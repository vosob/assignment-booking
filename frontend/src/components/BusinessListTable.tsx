import { useEffect, useState } from "react";
import type { User } from "../types/user";
import type { Booking } from "../types/business";
import { createBooking, getCurrentUserBookingsList } from "../api/bookings";
import { ReserveModal, type Slot } from "./ReserveModal";
import { Modal } from "./Modal";
import { LoadingError } from "./LoadingError";

type Props = {
  users: User[];
  setListMyBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
};

export const BusinessListTable = ({ users, setListMyBookings }: Props) => {
  const [selectedBusiness, setSelectedBusiness] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCurrentUserBookingsList();
        setListMyBookings(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [setListMyBookings]);

  const handleSelectSlot = async (slot: Slot) => {
    if (!selectedBusiness) return;
    const newBooking = await createBooking({
      businessId: selectedBusiness.id,
      scheduledAt: slot.scheduledAt,
      endAt: slot.endAt,
    });
    setListMyBookings((prev) => [...prev, newBooking]);
    setOpenModal(false);
  };

  const closeModal = () => setOpenModal(false);

  if (loading || error) return <LoadingError loading={loading} error={error} />;

  return (
    <div className="mb-6">
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => {
                    setSelectedBusiness(user);
                    setOpenModal(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition cursor-pointer"
                >
                  Reserve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && selectedBusiness && (
        <Modal onClose={closeModal}>
          <ReserveModal
            businessId={selectedBusiness.id}
            onClose={closeModal}
            onSelectSlot={handleSelectSlot}
          />
        </Modal>
      )}
    </div>
  );
};
