import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import { FaCaretDown } from "react-icons/fa";
import DropDown from "./Utils-Comp/DropDown";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { photoURL } = user;
  const [dropDownState, setDropDown] = useState(false);

  
  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white shadow-md py-2 z-30 fixed top-0 left-0 w-full z">
        <div className="mx-auto max-w-7xl px-6 flex justify-end items-center">

          <div className="flex items-center space-x-3 relative">
            <Link to="/profile">
              <img src={photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
            </Link>
            <button onClick={() => setDropDown(!dropDownState)}>
              <FaCaretDown className="text-gray-600" />
            </button>
            {dropDownState && <DropDown />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
