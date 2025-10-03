import React from "react";

const ApplicationCard = ({

  id,
  name,
  email,
  university,
  contact,
  address,
  title,
  photoURL,
  status,
  onApprove,
  onReject,
}) => {

  return (
    <div className="bg-white shadow-xl relative rounded-xl px-6 p-10 flex flex-col sm:flex-row items-start gap-4 hover:scale-[1.02] transition-transform">

      {/* Profile Image */}
      <img
        src={photoURL}
        alt={name}
        className="w-24 h-24 object-cover rounded-full border-2 border-primary"
      />

      {/* Applicant Info */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Internship: <span className="text-primary">{title}</span>
        </h2>

        <p className="text-gray-700">
          <strong>Name:</strong> {name}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {email}
        </p>
        <p className="text-gray-700">
          <strong>University:</strong> {university}
        </p>
        <p className="text-gray-700">
          <strong>Contact:</strong> {contact}
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> {address}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="btn-container block my-auto">
        <div className="sm:mt-0 flex flex-row gap-3">
          <button
            onClick={()=>{onApprove()}}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
