import React from "react";

const InternTaskCard = ({ task, children, deadline }) => {


  console.log(new Date(deadline))

  return (
    <div className="bg-white shadow-2xl rounded-xl flex flex-col gap-3 p-4 mx-auto my-4 transition-transform transform hover:scale-105">
      {/* Task Title and Description */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{task.title}</h2>
        <p className="text-gray-700 mt-1">{task.description}</p>

        {/* Feedback paragraph if rejected */}
        {task.status === "rejected" && task.feedback && (
          <p className="text-sm text-red-600 mt-2">
            <strong>Feedback:</strong> {task.feedback}
          </p>
        )}
      </div>

      {/* Status and Deadline */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Show status only if task is submitted */}
        {task.submitted && task.status && (
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

        {/* Deadline (always shown if available) */}
        {deadline && (
          <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
            Deadline: {deadline}
          </span>
        )}
      </div>

      {/* Children Slot for Submit Form/Button */}
      {(!task.submitted || task.status === "rejected") && children}
    </div>
  );
};

export default InternTaskCard;
