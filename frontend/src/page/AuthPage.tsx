import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export type ActivePathType = "login" | "register";

export const AuthPage = () => {
  const [activePath, setActivePath] = useState<ActivePathType>("login");

  return (
    <div>
      <div className="flex justify-between items-center gap-4 px-2 pb-2 w-70 mx-auto text-xl border-b-2 border-b-gray-500">
        <button
          className={`cursor-pointer ${activePath === "login" ? "underline" : ""}`}
          onClick={() => setActivePath("login")}
        >
          Login
        </button>
        <button
          className={`cursor-pointer ${
            activePath === "register" ? "underline" : ""
          }`}
          onClick={() => setActivePath("register")}
        >
          Register
        </button>
      </div>
      {activePath === "login" && <LoginForm />}
      {activePath === "register" && <RegisterForm />}
    </div>
  );
};
