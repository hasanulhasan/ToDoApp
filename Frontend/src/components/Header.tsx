import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxHooks";
import { logout, selectAuth } from "../features/auth/authSlice";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Header() {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
   const { toggle } = useDarkMode();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="container mx-auto p-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold">
            TodoApp
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="toggle-dark"
            onClick={toggle}
            className="px-2 py-1 rounded cursor-pointer"
          >
            🌓
          </button>
          {auth.accessToken ? (
            <>
              <span className="text-sm opacity-80">
                {auth.user?.name ?? auth.user?.email}
              </span>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                Logout
              </button>
              
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
