import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const roles = [auth?.role];
  const location = useLocation();


  // CHECK IF USER IS OF THE AUTHORIZED ROLES
  if (roles?.find((role) => allowedRoles?.includes(role))) {
    return <Outlet />;
  } else if (auth?.user && auth?.user !== undefined) {
    // IF LOGGED IN AND NOT AUTHORIZED SEND TO UNAUTH PAGE
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
