import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AdminControl from "../Admin-Dashboard/AdminControl";
import { FaClock } from "react-icons/fa";

const InternshipCard = ({
  title,
  img_url,
  internshipId,
  duration,
  children,
}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition cursor-pointer text-center">
      
      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
        <img
          src={img_url}
          alt={title}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

      {children}

      {duration && (
        <>
          <div className="mt-4 flex items-center justify-center gap-3 font-bold">
            <FaClock className="text-xl text-gray-500" />
            <h1 className="text-lg">Duration: {duration}</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default InternshipCard;
