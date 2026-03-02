import { Link } from "react-router-dom";
import { useAuth } from "../context/contextAuth";

export const Header = () => {
  const { logout, isAuthenticated, user } = useAuth();

  return (
    <header>
      <nav>
        <ul className="container mx-auto flex gap-8 justify-center py-6 text-2xl">
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isAuthenticated && (
            <li>
              <Link to="/auth">Auth</Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
          )}
          {isAuthenticated && user?.role === "ADMIN" && (
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button className="cursor-pointer underline" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
