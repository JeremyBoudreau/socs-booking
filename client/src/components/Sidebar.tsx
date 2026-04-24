import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "sidebar-link active" : "sidebar-link";

export default function Sidebar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) as { role: string } : null;
  const isOwner = user?.role === "owner";

  return (
    <div className="sidebar">
      <div className="menu-label">MENU</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={getLinkClass}>
          Dashboard
        </NavLink>

        {isOwner && (
          <NavLink to="/slots" className={getLinkClass}>
            Slots
          </NavLink>
        )}
      </nav>
    </div>
  );
}
