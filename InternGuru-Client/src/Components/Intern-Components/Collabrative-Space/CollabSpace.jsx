import React, { useEffect, useState } from "react";
import { useGetCollabrativeTasksQuery } from "../../../Store/app-api-slice";
import { useSelector } from "react-redux";
import GridContainer from "../../Utils-Comp/GridContainer";
import { Link } from "react-router-dom";
import { useCollab } from "./CollabProvider";

const CollabSpace = () => {
  const { user } = useSelector((state) => state.auth);
  const [onlineUsersState, setOnlineUsersState] = useState([]);

  const {
    data: collabTasks = [],
    isLoading,
    error,
  } = useGetCollabrativeTasksQuery(user.internship_id);
  const { socket, onlineUsers } = useCollab();

  useEffect(() => {
    if (!socket) {
      setOnlineUsersState([]);
      return;
    }
    setOnlineUsersState(Object.values(onlineUsers || {})); // Convert object to array
  }, [onlineUsers, socket]);

  const renderInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (error) {
    return (
      <p className="text-red-600">Error loading tasks. Please try again.</p>
    );
  }

  if (isLoading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (collabTasks.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          No Collaborative Tasks Exist
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Collaborative Tasks
      </h2>

      <GridContainer direction="row" cols="lg:grid-cols-3 gap-3">
        {collabTasks.map((task) => (
          <Link to={`/collab/board/${task._id}`} key={task._id}>
            <div className="bg-white shadow-2xl rounded-xl flex flex-col gap-3 p-4 transition-transform transform hover:scale-105">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Collaborative Space:{" "}
                <span className="font-bold text-blue-900">{task.title}</span>
              </h3>

              <div className="flex items-center justify-between mt-2">
                <div className="flex -space-x-2">
                  <div className="flex -space-x-2">
                    {onlineUsersState.map((user, index) => (
                      <img
                        key={index}
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.username}
                        title={user.username}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
                      />
                    ))}
                  </div>
                </div>

                <span className="text-sm text-gray-600">
                  {onlineUsersState.length} Intern
                  {onlineUsersState.length !== 1 && "s"} online
                </span>
              </div>
            </div>
          </Link>
        ))}
      </GridContainer>
    </div>
  );
};

export default CollabSpace;


