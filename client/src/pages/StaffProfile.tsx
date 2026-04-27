import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { authFetch } from "../utils/fetch";
import { formatTime } from "../utils/time";
import PollDemoPage from "../components/PollDemoPage";
import type { Slot } from "../types";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

const StaffProfile: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [ownerName, setOwnerName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser
    ? (JSON.parse(storedUser) as { userId: string })
    : null;

  const fetchSlots = useCallback(() => {
    authFetch("/api/oh")
      .then((r) => r.json())
      .then((all: Slot[]) =>
        setSlots(all.filter((s) => s.ownerId === ownerId)),
      );
  }, [ownerId]);

  useEffect(() => {
    fetchSlots();
    authFetch(`/api/users/${ownerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setOwnerName(data.name);
      });
  }, [ownerId, fetchSlots]);

  const handleBook = async (slot: Slot) => {
    setError("");
    const res = await authFetch(`/api/oh/${slot._id}/book`, {
      method: "POST",
    });
    if (res.ok) {
      window.location.assign(
        `mailto:${slot.ownerEmail}?subject=New Booking&body=Hi, your slot for ${slot.course} on ${slot.date} at ${slot.time} has been booked.`,
      );
      navigate("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to book slot");
    }
  };

  const handleRequest = async () => {
    setError("");

    const res = await authFetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId,
        course,
        date,
        time: formatTime(time),
        message,
      }),
    });

    if (res.ok) {
      window.location.assign(
        `mailto:${slots[0]?.ownerEmail}?subject=Meeting Request&body=${message}`,
      );
      navigate("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to request meeting");
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
            {error && (
              <p style={{ color: "#ED1B2F", margin: "0 0 12px" }}>{error}</p>
            )}
            <div className="request-box">
              <h3>Book a One-on-One Meeting</h3>

              <input
                placeholder="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button className="button green" onClick={handleRequest}>
                Send Request
              </button>
            </div>
            <h3 style={{ margin: "24px 0 12px" }}>Availability</h3>
            {slots.length === 0 && (
              <p style={{ color: "#b9b9b9" }}>No active slots available.</p>
            )}
            {slots.map((slot) => {
              const date = new Date(slot.date);
              const month = date
                .toLocaleString("default", { month: "short" })
                .toUpperCase();
              const day = date.getDate();
              const isOwn = currentUser?.userId === slot.ownerId;
              return (
                <div key={slot._id} className="slot-row">
                  <div className="row-left">
                    <div className="slot-row-date">
                      <span className="month">{month}</span>
                      <span className="day">{day}</span>
                    </div>
                    <div
                      className="appointment-info"
                      style={{ marginLeft: "12px" }}
                    >
                      <div className="title">
                        {slot.course.toUpperCase()} · {slot.type}
                      </div>
                      <div className="info">{slot.time}</div>
                    </div>
                  </div>
                  <div className="grouped-actions">
                    {!isOwn && (
                      <button
                        className="button green"
                        onClick={() => handleBook(slot)}
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <PollDemoPage />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaffProfile;
