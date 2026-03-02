import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../types/user";
import { partialUserSchema, type PartialUserSchema } from "../utils/userSchema";

interface EditUserFormProps {
  onClose: () => void;
  initialUser: User;
  onSave: (user: User) => void;
}

export const EditUserModal = ({
  onClose,
  initialUser,
  onSave,
}: EditUserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartialUserSchema>({
    resolver: zodResolver(partialUserSchema),
    defaultValues: {
      name: initialUser.name,
      email: initialUser.email,
      role: initialUser.role,
    },
  });

  const onSubmit = async (data: PartialUserSchema) => {
    try {
      await onSave({ ...initialUser, ...data });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-center text-2xl">Edit user</h2>
      {/* Name */}

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

      {/* Email */}

      <div className="flex justify-between items-center">
        <label htmlFor="email" className="text-lg  px-1">
          Email
        </label>
        <input
          className="text-xl outline-0 border border-gray-400 px-2 py-1 w-60"
          type="text"
          id="email"
          defaultValue={initialUser.email}
          {...register("email")}
        />
      </div>
      {errors.email && (
        <p className="text-xs text-red-500">{errors.email.message}</p>
      )}

      {/* Role */}

      <div className="flex flex-col gap-1">
        <span className="text-lg px-1">Role</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              value="CLIENT"
              {...register("role")}
              defaultChecked={initialUser.role === "CLIENT"}
            />
            <span>Client</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              value="BUSINESS"
              {...register("role")}
              defaultChecked={initialUser.role === "BUSINESS"}
            />
            <span>Business</span>
          </label>
        </div>
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      {/* Control buttons */}
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-800 text-white px-6  cursor-pointer rounded-lg"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-blue-800 text-white px-6  cursor-pointer rounded-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
