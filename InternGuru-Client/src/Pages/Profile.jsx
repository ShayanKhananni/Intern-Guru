import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUpdateUserMutation } from "../Store/auth-api-slice";
import DynamicUpdateForm from "../Components/Admin-Dashboard/DynamicUpdateForm";
import { authActions } from "../Store/auth-slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const initialValues = {
    image: user.photoURL || "",
    username: user.username || "",
    fathername: user.fathername || "",
    email: user.email || "",
    university: user.university || "",
    contact: user.contact || "",
    program: user.program || "",
    address: user.address || "",
  };

  const handleOnSubmit = async (formData) => {
    const updatedFormData = new FormData();
    updatedFormData.append("id", user._id);

    for (const [key, value] of formData.entries()) {
      if (key === "image") {
        if (value instanceof File && value !== initialValues.image) {
          updatedFormData.append("image", value);
        }
      } else if (value !== initialValues[key]) {
        updatedFormData.append(key, value);
      }
    }

    try {
      const res = await updateUser(updatedFormData).unwrap();
      toast.success(res.message);
      dispatch(authActions.updateUser(res.updatedUser));
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  const fields = [
    { name: "image", type: "image", required: true },
    { name: "username", type: "text", required: true },
    { name: "fathername", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "university", type: "text", required: true },
    { name: "contact", type: "text", required: true },
    { name: "address", type: "text", required: true },
    { name: "program", type: "text", required: true },
  ];

  return (
    <DynamicUpdateForm
      initValues={initialValues}
      fields={fields}
      title="Update Profile"
      handleOnSubmit={handleOnSubmit}
      isLoading={isLoading}
    />
  );
};

export default Profile;
