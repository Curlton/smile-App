import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ManagerRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading user data...</p>;

  const isManagerOrAdmin = user && (
    user.role === "manager" ||
    user.role === "admin" ||
    user.is_superuser
  );

  if (!isManagerOrAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ManagerRoute;

