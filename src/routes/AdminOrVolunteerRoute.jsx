import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";

export default function AdminOrVolunteerRoute({ children }) {
  const { user, loading, jwtLoading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || jwtLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user?.email) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  const allowed = role === "admin" || role === "volunteer";
  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
