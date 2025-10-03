import React from "react";
import { Link } from "react-router-dom";

const InternCatCard = ({ title, img_url, catId, children }) => {
  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-xl transition cursor-pointer text-center">
        <Link to={`/internships/${catId}`}>
          <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center shadow-sm">
            <img
              src={img_url}
              alt={title}
              className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </Link>

        {children}
      </div>
    </>
  );
};

export default InternCatCard;
