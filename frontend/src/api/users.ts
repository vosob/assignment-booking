import type {
  LoginSchema,
  PartialUserSchema,
  UserSchema,
} from "../utils/userSchema";
import { instance } from "./axiosInstant";

interface AuthResponse {
  accessToken: string;
}

export const getAllUser = async () /*: Promise<User[]>*/ => {
  const res = await instance.get("/user/all");
  return res.data;
};

export const registerUser = async (
  userRegisterData: UserSchema,
): Promise<AuthResponse> => {
  const res = await instance.post("/auth/register", userRegisterData);
  return res.data;
};

export const loginUser = async (
  userRegisterData: LoginSchema,
): Promise<AuthResponse> => {
  const res = await instance.post("/auth/login", userRegisterData);
  return res.data;
};

export const PatchEditUser = async (id: string, data: PartialUserSchema) => {
  const res = await instance.patch(`/user/edit/${id}`, data);
  return res.data;
};

export const me = async (token?: string) => {
  const res = await instance.get("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const logoutUser = async () => {
  const res = await instance.post("/auth/logout");
  return res.data;
};

export const getBusinessUser = async () => {
  const res = await instance.get("/user/business");
  return res.data;
};

export const getBusinessUserSlots = async (
  businessId: string,
  date: string,
) => {
  const res = await instance.get(`/bookings/${businessId}/slots`, {
    params: { date },
  });
  return res.data as { time: string; scheduledAt: string; endAt: string }[];
};

export const deleteUser = async (id: string) => {
  const res = await instance.delete(`/user/delete/${id}`);
  return res.data;
};
