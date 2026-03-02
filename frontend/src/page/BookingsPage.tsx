import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { getBusinessUser } from "../api/users";
import { Modal } from "../components/Modal";
import { ReserveModal, type Slot } from "../components/ReserveModal";
import {
  createBooking,
  deleteBooking,
  getCurrentUserBookingsList,
} from "../api/bookings";
import type { Booking } from "../types/business";

export const BookingsPage = () => {
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [listMyBookings, setListMyBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getBusinessUser();
        console.log(res);
        setUser(res);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, []);

  useEffect(() => {
    const getListBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getCurrentUserBookingsList();
        console.log(res);
        setListMyBookings(res);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    getListBookings();
  }, []);

  const closeModal = () => setOpenModal(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleSelectSlot = async (slot: Slot) => {
    if (!editUser) return;
    const newBooking = await createBooking({
      businessId: editUser.id,
      scheduledAt: slot.scheduledAt,
      endAt: slot.endAt,
    });

    setListMyBookings((prev) => [...prev, newBooking]);

    setOpenModal(false);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);

      setListMyBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId),
      );
    } catch (error) {
      console.error(error);
    }
  };

  console.log("bla", listMyBookings);
  return (
    <div className="container mx-auto">
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
                    Reserve
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {listMyBookings.length > 0 ? (
        <div>
          <h2 className="text-2xl text-center py-4">My Bookings</h2>
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Shedulet</th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {listMyBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.business.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.business.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(booking.scheduledAt).toLocaleString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center gap-2">
                    <div className="flex justify-center gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition cursor-pointer">
                        Change time
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition cursor-pointer"
                      >
                        Delete booking
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-4 text-center">You have no bookings yet</p>
      )}

      {openModal && editUser && (
        <Modal onClose={closeModal}>
          <ReserveModal
            businessId={editUser.id}
            onClose={closeModal}
            onSelectSlot={handleSelectSlot}
          />
        </Modal>
      )}
    </div>
  );
};
