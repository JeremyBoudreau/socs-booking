import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? (JSON.parse(storedUser) as {
        firstName: string;
        lastName: string;
        role: string;
      })
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const capitalizeName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const displayRole = (role: string) =>
    role === "owner" ? "OWNER" : "STUDENT";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="navbar-left">
        <img src="/mcgill-logo.png" alt="McGill logo" className="navbar-logo" />
        <span className="navbar-title">| SOCS Connect</span>
      </Link>

      <nav className="navbar-links">
        {user ? (
          <div className="navbar-user" ref={ref}>
            <button
              className="navbar-user-btn"
              onClick={() => setOpen((o) => !o)}
            >
              <div className="navbar-icon">{getInitials()}</div>
              <span className="navbar-name">
                {capitalizeName(user.firstName)} {capitalizeName(user.lastName)}
              </span>
              <span
                className={`navbar-role ${user.role === "owner" ? "owner" : ""}`}
              >
                {displayRole(user.role)}
              </span>
            </button>
            {open && (
              <div className="navbar-dropdown">
                <button className="navbar-dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
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
