// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const AdminRoute = ({ children }) => {
  const [auth] = useAuth();

  if (!auth?.user || auth?.user?.email !== "admin@gmail.com") {
    return <Navigate to="/" replace />; // redirect to home
  }

  return children;
};

export default AdminRoute;