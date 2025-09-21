import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/useReduxHooks";
import { loginUser } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function onSubmit(values: Form) {
    try {
      await dispatch(loginUser(values)).unwrap();
      navigate("/app/todos");
    } catch (err: any) {
      alert(err?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.email && <p className="text-red-600 py-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
             {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.password && <p className="text-red-600 py-1">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Login
          </button>
          <Link to="/register" className="font-semibold">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
