import React from "react";
import { FaGithub, FaEdit, FaTrash } from "react-icons/fa";

const InternProjectCard = ({
  title,
  img_url,
  description,
  live_link,
  github_link,
  techStack,
  handleOnUpdate,
  handleOnDelelet,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition duration-300 text-white flex flex-col items-center text-center">
      {/* Image */}
      <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-700 flex items-center justify-center shadow-inner">
        <img
          src={img_url}
          alt={title}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-2 line-clamp-3">{description}</p>

      {/* Tech Stack */}
      {techStack && (
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400 mb-3">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="bg-gray-700 px-2 py-1 rounded-full text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 w-full mt-auto">
        <div className="flex flex-row justify-around items-center gap-3 w-full">
          {live_link && (
            <a
              href={live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition font-semibold text-sm w-full"
            >
              Live Demo
            </a>
          )}

          {github_link && (
            <a
              href={github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition font-semibold text-sm w-full flex items-center justify-center gap-2"
            >
              <FaGithub /> GitHub
            </a>
          )}
        </div>

        {/* Update + Delete Buttons Side by Side */}
        <div className="flex justify-between gap-3 mt-2">
          <button
            onClick={handleOnUpdate}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition font-semibold text-sm w-full"
          >
            <FaEdit /> Update
          </button>

          <button
            onClick={handleOnDelelet}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition font-semibold text-sm w-full"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternProjectCard;
