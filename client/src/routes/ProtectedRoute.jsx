import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "@/context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
