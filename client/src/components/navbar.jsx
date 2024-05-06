import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="base">
      <div>
        <Link to="/" class="logo ps-4 primary-font underline">
          Lengua
        </Link>
      </div>
      <ul class="nav-links montserrat">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/lyrics">Lyrics</Link>
        </li>
        <li>
          <Link to="/write">Free Write</Link>
        </li>
      </ul>
    </nav>
  )
}