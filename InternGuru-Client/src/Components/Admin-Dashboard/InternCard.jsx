import React from "react";
import { Link } from "react-router-dom";



const InternCard = ({intern}) => {
  return (
    <> 

<div className="bg-white shadow-xl relative rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4 hover:scale-[1.02] transition-transform">
  {/* Profile Image */}
  <img
    src={intern.photoURL}
    alt={intern.username}
    className="w-24 h-24 object-cover rounded-full border-2 border-primary"
  />

  {/* Applicant Info */}
  <div className="flex-1">
    <h2 className="text-xl font-bold text-gray-800 mb-1">
      Internship: <span className="text-primary">{intern.internship_title}</span>
    </h2>

    <p className="text-gray-700">
      <strong>Name:</strong> {intern.username}
    </p>

    <p className="text-gray-700">
      <strong>Email:</strong> {intern.email}
    </p>

    {/* View Progress Button */}
    <div className="mt-4">
      <Link
        to={`/admin/view/intern/progress/${intern.intern_id}/${intern.internship_id}`}
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition"
      >
        View Progress
      </Link>
    </div>
  </div>
</div>

    </>
  );
};

export default InternCard;
