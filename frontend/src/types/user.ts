export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "CLIENT" | "BUSINESS" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
