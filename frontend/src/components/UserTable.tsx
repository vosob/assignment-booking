import type { User } from "../types/user";

interface UserTableProps {
  user: User[];
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserTable = ({
  user,
  setOpenModal,
  setEditUser,
  onDeleteUser,
}: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2 text-center gap-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditUser(user);
                      setOpenModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
