import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AddButton from "../Utils-Comp/AddButton";
import GridContainer from "../Utils-Comp/GridContainer";
import Control from "../Utils-Comp/Control";

import TaskCard from "./TaskCard";
import AdminControl from "../Admin-Dashboard/AdminControl";
import {
  useDeleteTaskMutation,
  useGetTasksByInternshipQuery,
} from "../../Store/app-api-slice";

const ViewTasks = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);


  
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useGetTasksByInternshipQuery(id);


  console.log(tasks);

  const [deleteTask] = useDeleteTaskMutation();

  return (
    <>
      <AddButton text={"Add Task"} to={`/admin/add/task/${id}`} />

      <GridContainer cols="lg:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            title={task.title}
            description={task.description}
          >
            <AdminControl
              editStyle={"my-auto h-10 mx-3"}
              deleteFunction={() => {
                deleteTask({ id: task._id, internship_id: task.internship_id });
              }}
              updateLink={`/admin/update/task/${task._id}/${task.internship_id}`}
            />

            <Control submitTask={true} />
            
          </TaskCard>
        ))}
      </GridContainer>
    </>
  );
};

export default ViewTasks;
