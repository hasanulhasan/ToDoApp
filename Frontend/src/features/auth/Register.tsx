import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/useReduxHooks";
import { registerUser } from "./authSlice";
import { useNavigate } from "react-router-dom";

type Form = { name: string; email: string; password: string };

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function onSubmit(values: Form) {
    try {
      await dispatch(registerUser(values)).unwrap();
      navigate("/app/todos");
    } catch (err: any) {
      alert(err?.message || "Register failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full border rounded px-2 py-1"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
