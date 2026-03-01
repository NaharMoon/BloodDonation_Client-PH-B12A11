import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading, jwtLoading } = useAuth();
  const location = useLocation();

  if (loading || jwtLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user?.email) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  return children;
}
