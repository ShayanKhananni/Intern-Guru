import React from "react";

const TaskCard = ({ title, description, children }) => {
  return (
    <div className="bg-white shadow-2xl rounded-xl flex p-4 mx-auto my-4 transition-transform transform hover:scale-105">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      {children}
    </div>
  );
};

export default TaskCard;
