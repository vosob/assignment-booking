import 'express';
import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    cookies: {
      accessToken?: string;
      refreshToken?: string;
      [key: string]: string | undefined;
    };
    user?: User;
  }
}
export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}
