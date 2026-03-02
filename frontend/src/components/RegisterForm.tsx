import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema, type UserSchema } from "../utils/userSchema";
import { registerUser } from "../api/users";
import { useAuth } from "../context/contextAuth";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: "CLIENT" },
  });

  const { createToken } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: UserSchema) => {
    try {
      console.log(1);
      const { accessToken } = await registerUser(data);
      await createToken(accessToken);
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
      {/* Name */}

      <div className="flex flex-col w-full">
        <label htmlFor="name" className="text-lg px-1">
          Name
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1 "
          type="text"
          id="name"
          {...register("name")}
        />
      </div>
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      {/* Email */}

      <div className="flex flex-col w-full">
        <label htmlFor="email" className="text-lg  px-1">
          Email
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1"
          type="text"
          id="email"
          {...register("email")}
        />
      </div>

      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      {/* Password */}

      <div className="flex flex-col w-full">
        <label htmlFor="password" className="text-lg  px-1">
          Password
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1"
          type="password"
          id="password"
          {...register("password")}
        />
      </div>
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}

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
