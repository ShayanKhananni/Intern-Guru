import React from "react";
import { useSelector } from "react-redux";
import MainContent from "../Components/Utils-Comp/MainContent";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return user && user.role === "admin" ? (
    <>
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoutes;
