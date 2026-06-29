import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="base">
      <div>
        <Link to="/" className="logo ps-4 primary-font underline">
          Lengua
        </Link>
      </div>
      <ul className="nav-links montserrat">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/lyrics">Lyrics</Link>
        </li>
        <li>
          <Link to="/write">Free Write</Link>
        </li>
        {user ? (
          <li>
            <button onClick={handleLogout} className="navbar-logout-btn">
              Log out
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Log in</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
