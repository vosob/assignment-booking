import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserSchema } from "../utils/userSchema";
import { getAllUser, registerUser } from "../api/users";
import type { User } from "../types/user";

interface UserFormProps {
  onUserAdded: (user: User) => void;
}

export const UserForm = ({ onUserAdded }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserSchema>({
    defaultValues: { role: "CLIENT" },
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserSchema) => {
    try {
      await registerUser(data);

      const allUsers = await getAllUser();

      const newUser = allUsers.find((u: User) => u.email === data.email);
      if (!newUser) throw new Error("Failed to fetch newly created user");

      onUserAdded(newUser);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-center text-2xl">Add user</h2>
      {/* Name */}
      <>
        <div className="flex justify-between items-center">
          <label htmlFor="name" className="text-lg px-1">
            Name
          </label>
          <input
            className="text-xl outline-0 border border-gray-400 px-2 py-1 w-60"
            type="text"
            id="name"
            {...register("name")}
          />
        </div>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </>

      {/* Email */}
      <>
        <div className="flex justify-between items-center">
          <label htmlFor="email" className="text-lg  px-1">
            Email
          </label>
          <input
            className="text-xl outline-0 border border-gray-400 px-2 py-1 w-60"
            type="text"
            id="email"
            {...register("email")}
          />
        </div>

        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </>

      {/* Password */}
      <>
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-lg  px-1">
            Password
          </label>
          <input
            className="text-xl outline-0 border border-gray-400 px-2 py-1 w-60"
            type="password"
            id="password"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </>

      {/* Role */}
      <>
        <div className="flex flex-col gap-1">
          <span className="text-lg px-1">Role</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                className="cursor-pointer"
                type="radio"
                value="CLIENT"
                {...register("role")}
                defaultChecked
              />
              Client
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                className="cursor-pointer"
                type="radio"
                value="BUSINESS"
                {...register("role")}
              />
              Business
            </label>
          </div>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>
      </>

      {/* Submit */}
      <button
        type="submit"
        className="text-xl px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition cursor-pointer"
      >
        Confirm
      </button>
    </form>
  );
};
