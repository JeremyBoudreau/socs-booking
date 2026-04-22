import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) as { firstName: string; lastName: string; role: string } : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-left">
        <img src="/mcgill-logo.png" alt="McGill logo" className="navbar-logo" />
        <span className="navbar-title">| SOCS Connect</span>
      </Link>

      <nav className="navbar-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span className="navbar-name">{user.firstName} {user.lastName}</span>
            <button className="navbar-logout" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
