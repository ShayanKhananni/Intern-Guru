import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUser, FaSignOutAlt, FaUsers, FaUserGraduate, FaEnvelope, FaBook } from "react-icons/fa";
import logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useLogOutMutation } from "../../Store/auth-api-slice";
import { toast } from "react-toastify";
import { authActions } from "../../Store/auth-slice";
import { CiMemoPad } from "react-icons/ci";
import { FaDiagramProject } from "react-icons/fa6";
import { FaGlobe } from "react-icons/fa";





const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [logOut] = useLogOutMutation()

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      dispatch(authActions.signOut());
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to logout.");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="h-screen w-56  bg-gray-800 fixed top-0 left-0 z-30 pt-16 px-5">
        <nav className="flex flex-col space-y-4 text-white">
          <Link to="/" className="flex items-center space-x-2">
            <img className="h-10" src={logo} alt="Your Company" />
          </Link>

          <Link
            to="/profile"
            className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
          >
            <FaUser className="mr-2" /> Profile
          </Link>


          {user.role === "admin" && (
            <>
              <Link
                to="/"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaUserGraduate className="mr-2" /> Internships
              </Link>
              
              <Link
                to="/admin/interns"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaUsers className="mr-2" />Interns

              </Link>

              <Link
                to="/admin/applications"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaEnvelope  className="mr-2" /> Appliactions
              </Link>

              <Link
                to="/admin/tasks"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaTasks className="mr-2" /> Tasks
              </Link>

              <Link
                to="/admin/courses"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaBook className="mr-2" /> Courses
              </Link>

            </>
          )}

          {user.role === "intern" && (
            <>
              <Link
                to="/"
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaHome className="mr-2" /> Home
              </Link>
            </>
          )}

          {user.role === "intern" && user.isEnrolled && (
            <>
              <Link
                to={`/view/tasks/${user.internship_id}`}
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaTasks className="mr-2" /> My Tasks
              </Link>

              <Link
                to={`/view/courses/${user.internship_id}`}
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaBook className="mr-2" /> Courses
              </Link>

              <Link
                to={`/collab/space`}
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaGlobe className="mr-2" /> Collabrative-Space
              </Link>
              
              <Link
                to={`/resume`}
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <CiMemoPad className="mr-2" /> Resume-Builder
              </Link>

              
              <Link
                to={`/portfolio/builder`}
                className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
              >
                <FaDiagramProject className="mr-2" /> Portfolio-Builder
              </Link>

            </>
          )}

          <button
            
            onClick={()=>{handleLogout()}}
            className="flex items-center p-2 hover:bg-red-600 text-red-400 hover:text-white rounded-md transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>


        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
