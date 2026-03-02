import type { Slot } from "../components/ReserveModal";
import { instance } from "./axiosInstant";

export const createBooking = async (data: {
  businessId: string;
  scheduledAt: string;
  endAt: string;
}) => {
  const res = await instance.post("/bookings", data);
  return res.data;
};

export const getCurrentUserBookingsList = async () => {
  const res = await instance.get("/bookings/my-bookings");
  return res.data;
};

export const deleteBooking = async (bookingId: string) => {
  const res = await instance.delete(`/bookings/${bookingId}`);
  return res.data;
};

export const patchBooking = async (bookingId: string, data: Slot) => {
  const res = await instance.patch(`/bookings/${bookingId}`, data);
  return res.data;
};
