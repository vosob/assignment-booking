import axios from "axios";

export const instance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://assignment-booking-backend.onrender.com",
  withCredentials: true,
});
