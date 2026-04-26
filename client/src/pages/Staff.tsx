import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/fetch";
import type { Slot } from "../types";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

const capitalize = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Staff: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("/api/slots")
      .then((r) => r.json())
      .then(setSlots);
  }, []);

  const ownerMap = new Map<
    string,
    { ownerName: string; ownerEmail: string; count: number }
  >();
  for (const slot of slots) {
    if (!ownerMap.has(slot.ownerId)) {
      ownerMap.set(slot.ownerId, {
        ownerName: slot.ownerName || slot.ownerEmail,
        ownerEmail: slot.ownerEmail,
        count: 0,
      });
    }
    ownerMap.get(slot.ownerId)!.count++;
  }

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
            {ownerMap.size === 0 && (
              <p style={{ color: "#b9b9b9" }}>
                No staff with active slots available.
              </p>
            )}
            {[...ownerMap.entries()].map(([ownerId, owner]) => {
              const initials = owner.ownerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div key={ownerId} className="inner-row">
                  <div className="row-left">
                    <div className="navbar-icon">{initials}</div>
                    <div className="appointment-info">
                      <div className="title">{capitalize(owner.ownerName)}</div>
                      <div className="info">
                        {owner.count} active slot{owner.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="grouped-actions">
                    <button
                      className="button blue"
                      onClick={() => navigate(`/staff/${ownerId}`)}
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
