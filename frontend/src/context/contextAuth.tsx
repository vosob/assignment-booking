import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import { tokenUtils } from "./auth-utils";
import { instance } from "../api/axiosInstant";
import type { AxiosRequestConfig } from "axios";
import { me } from "../api/users";
import type { User } from "../types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  user: User | null;
  createToken: (token: string) => Promise<void>;
  logout: () => void;
}

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Початкова перевірка автентифікації
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = tokenUtils.getToken();

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const user = await me(savedToken);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setToken(null);
        setIsAuthenticated(false);
        tokenUtils.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Request interceptor - додає Authorization header до кожного запиту
  useLayoutEffect(() => {
    const authInterceptor = instance.interceptors.request.use((config) => {
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      instance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Response interceptor - обробляє 401 помилки та оновлює токен
  useLayoutEffect(() => {
    const refreshInterceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfigWithRetry;

        // Перевіряємо чи це 401 помилка і чи не робили ми вже retry
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === "Unauthorized" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await instance.post("/auth/refresh");
            const newToken = response.data.accessToken;

            // Оновлюємо токен в стейті та storage
            setToken(newToken);
            setIsAuthenticated(true);
            tokenUtils.setToken(newToken);

            // Оновлюємо Authorization header для повторного запиту
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Повторюємо оригінальний запит з новим токеном
            return instance(originalRequest);
          } catch (refreshError) {
            // Якщо refresh не вдався - виходимо
            setToken(null);
            setIsAuthenticated(false);
            tokenUtils.removeToken();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const createToken = async (newToken: string) => {
    setIsLoading(true);
    tokenUtils.setToken(newToken);
    setToken(newToken);
    try {
      const userData = await me(newToken);
      setUser(userData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenUtils.removeToken();
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, createToken, user, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
