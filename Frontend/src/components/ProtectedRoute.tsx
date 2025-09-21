import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useReduxHooks";
import { selectAuth } from "../features/auth/authSlice";

const ProtectedRoute: React.FC = () => {
  const { accessToken } = useAppSelector(selectAuth);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;