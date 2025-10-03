import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetInternshipDurationQuery,
  useGetInternTasksQuery,
} from "../../Store/app-api-slice";
import GridContainer from "../Utils-Comp/GridContainer";
import Control from "../Utils-Comp/Control";
import InternTaskCard from "./InternTaskCard";
import ProgressBar from "../Utils-Comp/ProgressBar";
import { useEffect, useState } from "react";
import { generateTaskDeadlines } from "../../utils/utils";

const InternViewTasks = () => {
  const { id } = useParams();
  const [deadlineState, setDeadlineState] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useGetInternTasksQuery({ intern_id: user._id, internship_id: id });

  
  const approvedTasks = tasks.reduce((acc, task) => {
    if (task?.status === "approved") {
      acc.push(task);
    }
    return acc;
  }, []);

  const {
    data: durationData = {},
    isLoading: isDurationLoading,
    error: durationError,
  } = useGetInternshipDurationQuery(user._id);

  const totalTasks = tasks.length;



  useEffect(() => {
    if (durationData?.start_date && durationData?.duration?.value) {
      const startDate = new Date(durationData.start_date);
      const durationInMonths = durationData.duration.value;
      const deadlines = generateTaskDeadlines(
        startDate,
        durationInMonths,
        totalTasks
      );
      setDeadlineState(deadlines);
    }
  }, [durationData, totalTasks]);

  return (
    <>
      <ProgressBar
        progress={Math.round((approvedTasks.length / tasks.length) * 100)}
      />

      <GridContainer cols="lg:grid-cols-2 gap-3">
        {tasks.map((task, index) => (
          <InternTaskCard
            key={task._id}
            task={task}
            description={task.description}
            deadline={deadlineState ? deadlineState[index] : null}
          >
            <Control
              internId={user._id}
              taskDetails={task}
              submitTask={!task.submitted}
              updateTask={task.submitted}
            />
          </InternTaskCard>
        ))}
      </GridContainer>
    </>
  );
};

export default InternViewTasks;
