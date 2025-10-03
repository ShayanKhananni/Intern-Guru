import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";

const AdminCourseCard = ({
  title,
  img_url,
  internshipId,
  price_id,
  price,
  type,
  duration,
  children,
  link
}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition duration-300 cursor-pointer text-center flex flex-col items-center">
      {/* Image */}
      
      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
        <img
          src={img_url}
          alt={title}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

      {/* Optional custom content */}
      {children}

      {user.role === "admin" && (
        <div className="w-full mt-3">
          {price ? (
            <div className="flex flex-row justify-around items-center gap-3">
              <div className="text-black font-bold text-lg">Price: <span className="font-normal" >PKR-{price}</span> </div>
              <a
                href={link}
                className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition font-semibold text-center"
              >
                View
              </a>
            </div>
          ) : (
            <div className="flex flex-row justify-around items-center gap-3">
              <div className="text-black font-semibold text-lg">Free</div>
              <a
                href={link}
                className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition font-semibold text-center"
              >
                View
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCourseCard;
