import { Navigate, Outlet, useLocation } from "react-router-dom";

import Loader from "../shared/Components/Loader";
import { useAuth } from "../shared/Hooks/useAuth";
import Navigation from "../shared/Components/Navigation";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;
