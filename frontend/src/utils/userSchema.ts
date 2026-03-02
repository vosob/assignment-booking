import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Invalid email"),
  role: z.enum(["CLIENT", "BUSINESS", "ADMIN"]),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserSchemaWithoutName = Omit<UserSchema, "name">;

export const partialUserSchema = userSchema.partial();
export const partialUserSchemaWithoutName = partialUserSchema.omit({
  name: true,
});

export type PartialUserSchema = z.infer<typeof partialUserSchema>;
export type PartialUserSchemaWithoutName = Omit<PartialUserSchema, "name">;

export const loginSchema = userSchema.omit({ name: true, role: true });
export type LoginSchema = z.infer<typeof loginSchema>;
