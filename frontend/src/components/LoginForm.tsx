import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../utils/userSchema";
import { loginUser } from "../api/users";
import { useAuth } from "../context/contextAuth";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { createToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const { accessToken } = await loginUser(data);
      createToken(accessToken);
      navigate("/bookings");
    } catch (error) {
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-4 w-70 mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Email */}
      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-lg px-1">
          Email
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1"
          type="text"
          id="email"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-lg px-1">
          Password
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1"
          type="password"
          id="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="text-xl w-full px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition cursor-pointer"
      >
        Confirm
      </button>
    </form>
  );
};
