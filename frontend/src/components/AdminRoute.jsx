import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading user data...</p>;

  // Also consider superusers here if applicable
  const isAdmin = user && (user.role === "admin" || user.is_superuser);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

