import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; // (or better: Sidebar.css if you split later)

const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
        return "sidebar-link active";
    } else {
        return "sidebar-link";
    }
};

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="menu-label">MENU</div>


            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={getLinkClass}>
                    Dashboard
                </NavLink>

                <NavLink to="/professors" className={getLinkClass}>
                    Browse Professors & TAs
                </NavLink>

                <NavLink to="/appointments" className={getLinkClass}>
                    My Appointments
                </NavLink>

                <div className="sidebar-link logout">
                    Logout
                </div>
            </nav>
        </div>
    );
}