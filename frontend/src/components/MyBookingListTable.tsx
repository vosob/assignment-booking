import { useState } from "react";
import type { Booking } from "../types/business";
import { deleteBooking, patchBooking } from "../api/bookings";
import { Modal } from "./Modal";
import { ReserveModal, type Slot } from "./ReserveModal";

interface Props {
  listMyBookings: Booking[];
  setListMyBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  editBooking: Booking | null;
  setEditBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
}

export const MyBookingListTable = ({
  listMyBookings,
  setListMyBookings,
  editBooking,
  setEditBooking,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const handleEditBookingSlot = async (slot: Slot) => {
    if (!editBooking) return;
    const updatedBooking = await patchBooking(editBooking.id, {
      scheduledAt: slot.scheduledAt,
      endAt: slot.endAt,
    });
    setListMyBookings((prev) =>
      prev.map((b) => (b.id === editBooking.id ? updatedBooking : b)),
    );
    setEditBooking(null);
    setOpenModal(false);
  };

  const handleDeleteBooking = async (id: string) => {
    await deleteBooking(id);
    setListMyBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const closeModal = () => setOpenModal(false);

  return (
    <div>
      {listMyBookings.length > 0 ? (
        <div>
          <h2 className="text-2xl text-center py-4">My Bookings</h2>
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Schedule</th>
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
                  <td className="border border-gray-300 px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditBooking(booking);
                        setOpenModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition cursor-pointer"
                    >
                      Change time
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition cursor-pointer"
                    >
                      Delete booking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-4 text-center">You have no bookings yet</p>
      )}

      {openModal && editBooking && (
        <Modal onClose={closeModal}>
          <ReserveModal
            businessId={editBooking.businessId}
            onClose={closeModal}
            onSelectSlot={handleEditBookingSlot}
            initialDate={new Date(editBooking.scheduledAt)}
          />
        </Modal>
      )}
    </div>
  );
};
