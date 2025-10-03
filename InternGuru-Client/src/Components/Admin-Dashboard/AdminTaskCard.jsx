import React, { useState } from "react";
import TaskResponseDialog from "./TaskResponseDialog";

const AdminTaskCard = ({ task, deadline, internId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="bg-white shadow-2xl rounded-xl flex flex-col gap-3 p-4 mx-auto my-4 transition-transform transform hover:scale-105">
      {/* Task Info */}
      
      <div>
        <h2 className="text-2xl font-semibold">{task.title}</h2>

        <p className="font-bold my-2 text-black text-sm">
          Github-link:{" "}
          <span className="text-blue-600">{task.github_link}</span>
        </p>

        <p className="font-bold my-2 text-black text-sm">
          Deployed-link:{" "}
          <span className="text-blue-600">{task.deployed_link}</span>
        </p>
      </div>

      {/* Task Status and Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Status Badge */}
        {task.status && (
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              task.status === "approved"
                ? "bg-green-100 text-green-700"
                : task.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        )}

        {/* Conditional Rendering Based on Submission */}
        {task.submitted ? (
          <>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200"
              onClick={() => setDialogOpen(true)}
            >
              Manage
            </button>

            <TaskResponseDialog
              task={task}
              open={dialogOpen}
              setOpen={setDialogOpen}
              subId={task.submission_id}
              internId={internId}
              handleCancel={() => setDialogOpen(false)}
              customFormStyle={{
                button: "bg-red-500 text-white px-6 py-2 rounded",
              }}
            />
          </>
        ) : (
          <>
            <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
              Not Submitted
            </span>

            {/* Show Deadline if Not Submitted */}
            {deadline && (
              <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
                Deadline: {deadline}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTaskCard;
