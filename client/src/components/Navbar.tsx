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

  const getInitials = () => { 
    if (!user) return ""; 
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }; 

  const capitalizeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  const displayRole = (role: string) => {
    if (role === "owner") return "OWNER";
    return "STUDENT";
  };


  return (
    <header className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="navbar-left">
        <img src="/mcgill-logo.png" alt="McGill logo" className="navbar-logo" />
        <span className="navbar-title">| SOCS Connect</span>
      </Link>

      <nav className="navbar-links">
        {user ? (
          <div className="navbar-user">
            <div className="navbar-icon">{getInitials()}</div>
            <span className="navbar-name">{capitalizeName(user.firstName)} {capitalizeName(user.lastName)}</span>
            <span className={`navbar-role ${user.role === "owner" ? "owner" : ""}`}>{displayRole(user.role.toUpperCase())}</span>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
          </div>
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
