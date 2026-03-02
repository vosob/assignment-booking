import { useEffect, useState } from "react";
import { UserForm } from "../components/UserForm";
import type { User } from "../types/user";
import { deleteUser, getAllUser, PatchEditUser } from "../api/users";
import { UserTable } from "../components/UserTable";
import { Modal } from "../components/Modal";
import { EditUserModal } from "../components/EditUserModal";

export const AdminPage = () => {
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllUser();
        setUser(res);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, []);

  const closeModal = () => setOpenModal(false);

  const handleUpdateUser = async (updateUser: User) => {
    try {
      const updatedUser = await PatchEditUser(updateUser.id, updateUser);
      setUser((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUser((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex gap-16 p-6">
      <UserForm
        onUserAdded={(newUser) => setUser((prev) => [...prev, newUser])}
      />

      <UserTable
        setOpenModal={setOpenModal}
        onDeleteUser={handleDeleteUser}
        setEditUser={setEditUser}
        user={user}
      />

      {openModal && editUser && (
        <Modal onClose={closeModal}>
          <EditUserModal
            onSave={handleUpdateUser}
            initialUser={editUser}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};
