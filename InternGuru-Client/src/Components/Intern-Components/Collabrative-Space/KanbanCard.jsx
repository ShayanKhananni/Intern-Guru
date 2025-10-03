import React from "react";
import { MdDelete } from "react-icons/md";

const KanbanCard = ({ task, status, onDelete }) => {
  return (
    <>
      <li
        key={task._id}
        className={`
                      rounded-md px-3 p-5 my-2 text-white shadow-sm flex justify-between items-center
                      ${
                        status === "todo"
                          ? "bg-blue-500" // light blue for todo
                          : status === "doing"
                          ? "bg-yellow-500" // yellow/orange for in progress
                          : status === "done"
                          ? "bg-green-500" // light green for done
                          : ""
                      }
                    `}
      >
        <span className="text-2xl font-bold">{task.title}</span>
        <button
          onClick={() => {
            onDelete(task._id);
          }}
          className="text-2xl bg-white rounded-md p-2 text-red-500 hover:text-red-800"
        >
          <MdDelete />
        </button>
      </li>
    </>
  );
};

export default KanbanCard;


