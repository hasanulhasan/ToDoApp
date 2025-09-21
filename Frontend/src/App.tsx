import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { selectAuth, logout } from "./features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks/useReduxHooks";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import TodosPage from "./features/todos/TodosPage";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import TodoUpdate from "./features/todos/TodoUpdate";
import TodoSingle from "./features/todos/TodoSingle";

export default function App() {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth.accessToken) return;
    const id = setInterval(() => {
      if (auth.expiresAt && Date.now() > auth.expiresAt) {
        dispatch(logout());
      }
    }, 5000);
    return () => clearInterval(id);
  }, [auth.accessToken, auth.expiresAt, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/app/todos" element={<TodosPage />} />
            <Route path="/app/todos/:id" element={<TodoUpdate />} />
            <Route path="/app/todos/details/:id" element={<TodoSingle />} />
          </Route>

          <Route path="/" element={<Navigate to="/app/todos" replace />} />
        </Routes>
      </main>
    </div>
  );
}
