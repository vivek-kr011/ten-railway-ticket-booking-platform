import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "@/context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/20 bg-blue-600/85 px-6 py-2.5 text-white shadow-lg shadow-blue-950/10 backdrop-blur-xl transition-all duration-300">
      {/* Logo / Brand */}
      <div>
        <Link
          to="/"
          className="text-lg font-bold tracking-tight transition hover:text-blue-100 sm:text-xl"
        >
          Ticket Booking System
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden items-center gap-6 md:flex">
        <Link to="/" className="font-medium transition hover:text-blue-200">
          Home
        </Link>

        <Link
          to="/search"
          className="font-medium transition hover:text-blue-200"
        >
          Search Trains
        </Link>

        <Link
          to="/my-bookings"
          className="font-medium transition hover:text-blue-200"
        >
          My Bookings
        </Link>
      </div>

      {/* Authentication */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden font-medium sm:inline">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:px-4"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition hover:bg-white/10 sm:px-4"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:px-4"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;