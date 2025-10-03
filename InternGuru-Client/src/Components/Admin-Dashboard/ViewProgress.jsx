import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetInternshipDurationQuery,
  useGetInternTasksQuery,
} from "../../Store/app-api-slice";
import GridContainer from "../Utils-Comp/GridContainer";
import AdminTaskCard from "./AdminTaskCard";
import ProgressBar from "../Utils-Comp/ProgressBar";
import { generateTaskDeadlines } from "../../utils/utils";


const ViewProgress = () => {
  const { intern_id, internship_id } = useParams();
  const [deadlineState,setDeadlineState] = useState(null)

  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    error: tasksError,
  } = useGetInternTasksQuery({ intern_id, internship_id });
  
  const {
    data: durationData = {},
    isLoading: isDurationLoading,
    error: durationError,
  } = useGetInternshipDurationQuery(intern_id);
  
  
  const totalTasks = tasks.length;
  
   useEffect(() => {
    if (durationData?.start_date && durationData?.duration?.value) {
      const startDate = new Date(durationData.start_date);
      const durationInMonths = durationData.duration.value;
      const deadlines = generateTaskDeadlines(startDate, durationInMonths, totalTasks) 
      setDeadlineState(deadlines)
    }
  }, [durationData, totalTasks]);
    

  
  const approvedTasks = tasks.reduce((acc, task) => {
    if (task?.status === 'approved') {
      acc.push(task);
    }
    return acc;
  }, []);
  


  return (
    <>
    
    <ProgressBar progress={Math.round((approvedTasks.length / tasks.length) * 100)} />

      <GridContainer cols="lg:grid-cols-2 gap-3">
        {tasks.map((task,index) => (
          <AdminTaskCard
            key={task._id}
            task={task}
            deadline={deadlineState ? deadlineState[index] : null} 
            internId={intern_id}
          >
            
          </AdminTaskCard>
        ))}
      </GridContainer>
    </>
  );
};

export default ViewProgress;
