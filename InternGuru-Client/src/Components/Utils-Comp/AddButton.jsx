import React from "react";
import { Link } from "react-router-dom";

const AddButton = ({ text, to }) => {
  return (
    <>
      {/* Add Internship Button */}
      <Link
        to={to}
        className="absolute top-20 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        style={{ zIndex: 10 }} // Set a z-index value that ensures the button is above other elements, but not too high to interfere with dropdown
      >
        + {text}
      </Link>
    </>
  );
};

export default AddButton;
