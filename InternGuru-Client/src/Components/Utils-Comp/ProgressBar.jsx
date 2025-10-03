import React from "react";

const ProgressBar = ({ progress = 50 }) => {
  return (
    <div className="w-full flex justify-center items-center my-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4">
        <h2 className="text-gray-800 font-semibold text-lg mb-2">Progress</h2>

        <div className="relative w-full bg-white border border-gray-300 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>

          {/* Numeric Percentage */}
          <span className="absolute inset-0 flex justify-center items-center text-sm font-medium text-black">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
