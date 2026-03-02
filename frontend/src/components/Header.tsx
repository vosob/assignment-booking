import { Link } from "react-router-dom";
import { useAuth } from "../context/contextAuth";

export const Header = () => {
  const { logout, isAuthenticated, user } = useAuth();

  return (
    <header>
      <nav>
        <ul className="container mx-auto flex gap-8 justify-center py-6 text-2xl">
          <Link to="/">Home</Link>
          {!isAuthenticated && <Link to="/auth">Auth</Link>}
          {isAuthenticated && <Link to="/bookings">Bookings</Link>}
          {isAuthenticated && user?.role === "ADMIN" && (
            <Link to="/admin">Admin Panel</Link>
          )}
          {isAuthenticated && (
            <button className="cursor-pointer underline" onClick={logout}>
              Logout
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
};
