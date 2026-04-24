import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/fetch";
import { formatTime } from "../utils/time";
import type { Slot } from "../types";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

const StaffProfile: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [ownerName, setOwnerName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) as { userId: string } : null;

  const fetchSlots = () => {
    authFetch("/api/slots")
      .then(r => r.json())
      .then((all: Slot[]) => {
        const filtered = all.filter(s => s.ownerId === ownerId);
        setSlots(filtered);
        if (filtered.length > 0) setOwnerName(filtered[0].ownerName || filtered[0].ownerEmail);
      });
  };

  useEffect(() => { fetchSlots(); }, [ownerId]);

  const handleBook = async (slot: Slot) => {
    setError("");
    const res = await authFetch(`/api/slots/${slot._id}/book`, { method: "POST" });
    if (res.ok) {
      navigate("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to book slot");
    }
  };

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="outer-box">
            <div className="outer-header">
              <h3>{ownerName ? `${ownerName}'s Slots` : "Available Slots"}</h3>
              <a href="/staff">← Back</a>
            </div>
            {error && <p style={{ color: "#d61f2c", margin: "0 0 12px" }}>{error}</p>}
            {slots.length === 0 && <p style={{ color: "#b9b9b9" }}>No active slots available.</p>}
            {slots.map(slot => {
              const date = new Date(slot.date);
              const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
              const day = date.getDate();
              const isOwn = currentUser?.userId === slot.ownerId;
              return (
                <div key={slot._id} className="slot-row">
                  <div className="row-left">
                    <div className="slot-row-date">
                      <span className="month">{month}</span>
                      <span className="day">{day}</span>
                    </div>
                    <div className="appointment-info" style={{ marginLeft: "12px" }}>
                      <div className="title">{slot.course.toUpperCase()} · {slot.type}</div>
                      <div className="info">{formatTime(slot.time)}</div>
                    </div>
                  </div>
                  <div className="grouped-actions">
                    {!isOwn && (
                      <button className="button green" onClick={() => handleBook(slot)}>Book</button>
                    )}
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

export default StaffProfile;
