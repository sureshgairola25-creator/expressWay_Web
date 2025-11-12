import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  // If token exists → redirect to home/dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access to public route (like login)
  return children;
};

export default PublicRoute;
