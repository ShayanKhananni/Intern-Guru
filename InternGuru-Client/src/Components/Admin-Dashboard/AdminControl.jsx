import React from "react";
import { useSelector } from "react-redux";
import { IoEye } from "react-icons/io5";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

const AdminControl = ({

  /// For CRUD Operations
  viewLink,
  updateLink,
  deleteFunction,

  // For Showing Links
  applications,
  tasks,
  interns,
  courses,
  
  removeEdit,
  internshipId,
  editStyle,

}) => {
  const user = useSelector((state) => {
    const u = state.auth.user;
    return typeof u === 'string' ? JSON.parse(u) : u;
  });

  if (user?.role !== "admin") return null;

  return (
    <>
      {tasks && (
        <Link
          to={`/admin/view/tasks/${internshipId}`}
          className="bg-indigo-600 my-2 block p-3 rounded-md text-lg font-medium hover:bg-indigo-700 text-white shadow-md transition-all duration-200 w-full text-center"
        >
          View Tasks
        </Link>
      )}

      {applications && (
        <Link
          to={`/admin/view/applications/${internshipId}`}
          className="bg-emerald-600 my-2 block p-3 rounded-md text-lg font-medium hover:bg-emerald-700 text-white shadow-md transition-all duration-200 w-full text-center"
        >
          View Applications
        </Link>
      )}

      {courses && (
        <Link
          to={`/admin/view/courses/${internshipId}`}
          className="bg-emerald-600 my-2 block p-3 rounded-md text-lg font-medium hover:bg-emerald-700 text-white shadow-md transition-all duration-200 w-full text-center"
        >
          View Courses
        </Link>
      )}

      {interns && (
        <Link
          to={`/admin/view/interns/${internshipId}`}
          className="bg-cyan-600 my-2 block p-3 rounded-md text-lg font-medium hover:bg-cyan-700 text-white shadow-md transition-all duration-200 w-full text-center"
        >
          View Interns
        </Link>
      )}

      {!removeEdit && (
        <div
          className={`${editStyle} controls-strip  my-3 flex justify-center items-center bg-gray-800 p-2 rounded-lg `}
        >
          {viewLink && (
            <Link
              to={viewLink}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg flex items-center mx-2"
            >
              <IoEye />
            </Link>
          )}

          {updateLink && (
            <Link
              to={updateLink}
              className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-lg flex items-center mx-2"
            >
              <HiPencilAlt className="text-lg" />
            </Link>
          )}

          {deleteFunction && (
            <button
              onClick={deleteFunction}
              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg flex items-center mx-2"
            >
              <MdDelete className="text-lg" />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default AdminControl;
