import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import MainContent from "../Components/Utils-Comp/MainContent";
import { CollabProvider } from "../Components/Intern-Components/Collabrative-Space/CollabProvider";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  return user ? (
    <>
        <MainContent>
          <Outlet />
        </MainContent>
    </>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;
