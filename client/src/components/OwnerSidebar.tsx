import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; // (or better: Sidebar.css if you split later)

const getLinkClass = ({ isActive }: { isActive: boolean }) => {
  if (isActive) {
    return "sidebar-link active";
  } else {
    return "sidebar-link";
  }
};

export default function OwnerSidebar() {
  return (
    <div className="sidebar">
      <div className="menu-label">MENU</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={getLinkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/myslots" className={getLinkClass}>
          Manage Slots
        </NavLink>

        <NavLink to="/appointments" className={getLinkClass}>
          My Appointments
        </NavLink>
      </nav>
    </div>
  );
}
