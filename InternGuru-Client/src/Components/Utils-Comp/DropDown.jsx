import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogOutMutation } from "../../Store/auth-api-slice";
import { toast } from "react-toastify";
import { authActions } from "../../Store/auth-slice";

const DropDown = () => {
  const dispatch = useDispatch();
  const [logOut] = useLogOutMutation();

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
      <div className="absolute top-10 right-8 md:right-14 drop-down shadow-customPositive bg-white z-50 rounded-md">
        <Link
          to="/profile"
          className="px-4 py-2 block hover:bg-blue-500 font-semibold cursor-pointer rounded-t-md"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 block hover:bg-blue-500 font-semibold cursor-pointer rounded-b-md"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default DropDown;
