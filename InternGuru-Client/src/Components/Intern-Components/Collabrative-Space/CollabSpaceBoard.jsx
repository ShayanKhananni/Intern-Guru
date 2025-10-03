import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCollab } from "./CollabProvider";
import GridContainer from "../../Utils-Comp/GridContainer";
import {
  useAddKanbanTaskMutation,
  useGetKanbanTasksQuery,
} from "../../../Store/app-api-slice";

import { MdDelete } from "react-icons/md";
import KanbanCard from "./KanbanCard";
import { toast } from "react-toastify";

const CollabSpaceBoard = () => {
  const { user } = useSelector((state) => state.auth);
  const { socket, onlineUsers } = useCollab();

  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  const [kanbanTasks, setKanbanTasks] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Join socket room
    socket.emit("join", user.username, user.photoURL);

    // Listen for task list
    const handleTaskList = (tasks) => {
      console.log("Received tasks:", tasks);
      setKanbanTasks(tasks);
    };
    const handelNotifications = (username, action) => {
      username === user.username
        ? toast.success(
            `Task ${action === "add" ? "Added" : "Deleted"}  Successfully`
          )
        : toast.success(
            `Task ${action === "add" ? "Added" : "Deleted"} By  ${
              username
            }`
          );
    };

    socket.on("task:list", handleTaskList);
    socket.on("notification", handelNotifications);

    // Cleanup
    return () => {
      socket.emit("leave", user.username);
      socket.off("task:list", handleTaskList);
    };
  }, [socket, user.username]);

  const handleAddTask = (e, status) => {
    const formData = new FormData(e.target);
    const title = formData.get("title");

    const task = {
      title,
      status,
    };

    socket.emit("task:create", task);
    socket.emit("notify", user.username, "add");
    e.target.reset();
  };

  const handleDeleteTask = (id) => {
    socket.emit("task:delete", id);
    socket.emit("notify", user.username, "delete");
  };

  const colType = [
    { title: "To Do", status: "todo" },
    { title: "In Progress", status: "doing" },
    { title: "Done", status: "done" },
  ];

  return (
    <>

<div className="online-interns bg-white w-2/5 mx-auto p-2 rounded-md shadow-md">
  <h3 className="text-xl mb-4 text-center font-bold">Online Interns</h3>

  <div className="flex items-center gap-4 flex-wrap">
    {onlineUsers.length === 0 ? (
      <p className="text-sm text-gray-500">No interns online</p>
    ) : (
      onlineUsers.map((user, index) => (
        <div key={index} className="flex flex-col items-center relative">
          <div className="relative">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt={user.username}
              title={user.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-sm"
            />
            {/* Green dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <span className="text-xs mt-1 text-gray-600 text-center w-16 truncate">
            {user.username}
          </span>
        </div>
      ))
    )}
  </div>
</div>

      <GridContainer cols="lg:grid-cols-3 gap-3">
        {colType.map((col) => {
          const { title, status } = col;
          return (
            <div>
              <div key={status} className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-2xl font-bold  text-center  mb-2">
                  {title}
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(e, status);
                  }}
                  className="mb-3"
                >
                  <input
                    type="text"
                    name="title"
                    placeholder={`Add ${title} task...`}
                    className="w-full border border-gray-300 rounded-lg p-4 text-md focus:outline-none  focus:ring-2 focus:ring-blue-400 transition duration-200 shadow-sm"
                  />
                </form>
              </div>

              <ul className="mt-5">
                {kanbanTasks
                  .filter((task) => task.status === col.status)
                  .map((task) => (
                    <KanbanCard
                      task={task}
                      status={status}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </ul>
            </div>
          );
        })}
      </GridContainer>
    </>
  );
};

export default CollabSpaceBoard;



