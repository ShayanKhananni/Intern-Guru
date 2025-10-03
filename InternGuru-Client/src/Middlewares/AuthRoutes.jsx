import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    // If user is authenticated, redirect based on role
    if (user.role === "intern" || user.role === "admin") {
      return <Navigate to="/" />;
    }
  }

  // If the user is not authenticated, allow access to the login/signup pages
  return <Outlet />;
};

export default AuthRoutes;
