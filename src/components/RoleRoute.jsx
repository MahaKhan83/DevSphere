import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ roles = [], children }) {
  const { user, token } = useContext(AuthContext);

  // not logged in
  if (!token) return <Navigate to="/login" replace />;

  // role check
  const userRole = user?.role || "user";
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}