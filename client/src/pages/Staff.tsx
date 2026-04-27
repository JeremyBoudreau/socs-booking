import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

type StaffView = {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  slotCount: number;
  pollCount: number;
};

const capitalize = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type Owner = { _id: string; name: string; email: string };

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffView[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("/api/staff/overview")
      .then((r) => r.json())
      .then(setStaff)
      .catch((err) => console.error("Failed to load staff", err));
  }, []);

  return (
    <div className="user-page">
      <Navbar />

      <div className="dashboard-container">
        <Sidebar />

        <div className="dashboard-content">
          <div className="outer-box">
            <div className="outer-header">
              <h3>Staff</h3>
            </div>

            {staff.length === 0 && (
              <p style={{ color: "#b9b9b9" }}>No staff available.</p>
            )}

            {staff.map((s) => {
              const initials = s.ownerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div key={s.ownerId} className="inner-row">
                  <div className="row-left">
                    <div className="navbar-icon">{initials}</div>

                    <div className="appointment-info">
                      <div className="title">{capitalize(s.ownerName)}</div>

                      <div className="info">
                        {s.slotCount} active slot{s.slotCount !== 1 ? "s" : ""}{" "}
                        · {s.pollCount} active poll
                        {s.pollCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="grouped-actions">
                    <button
                      className="button blue"
                      onClick={() => navigate(`/staff/${s.ownerId}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Staff;
