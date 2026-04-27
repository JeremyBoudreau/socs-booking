import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import type { Slot } from "../types";
import { authFetch } from "../utils/fetch";
import { displayTime, isoToMonthDay } from "../utils/time";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";
import "../styles/ManageSlots.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ManageSlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [rCourse, setRCourse] = useState("");
  const [rTimeSlots, setRTimeSlots] = useState<{ day: number; time: string; endTime: string }[]>(
    [],
  );
  const [rDay, setRDay] = useState(1);
  const [rAddTime, setRAddTime] = useState("");
  const [rAddEndTime, setRAddEndTime] = useState("");
  const [rStartDate, setRStartDate] = useState("");
  const [rWeeks, setRWeeks] = useState(1);
  const [rError, setRError] = useState("");
  const [rSuccess, setRSuccess] = useState("");

  const fetchSlots = useCallback(async () => {
    const res = await authFetch("/api/oh/created");
    const data = await res.json();
    setSlots(data);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAddTimeSlot = () => {
    if (!rAddTime || !rAddEndTime) return;
    setRTimeSlots((prev) => [...prev, { day: rDay, time: rAddTime, endTime: rAddEndTime }]);
    setRAddTime("");
    setRAddEndTime("");
  };

  const handleCreateRecurring = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setRError("");
    setRSuccess("");
    if (rTimeSlots.length === 0) {
      setRError("Add at least one time slot");
      return;
    }
    const res = await authFetch("/api/oh", {
      method: "POST",
      body: JSON.stringify({
        course: `COMP ${rCourse}`,
        timeSlots: rTimeSlots.map((s) => ({
          day: s.day,
          time: s.time,
          endTime: s.endTime,
        })),
        startDate: rStartDate,
        weeks: rWeeks,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setRError(data.error || "Failed to create slots");
      return;
    }
    setRSuccess(`${data.count} slots created.`);
    setRCourse("");
    setRTimeSlots([]);
    setRAddTime("");
    setRAddEndTime("");
    setRStartDate("");
    setRWeeks(1);
    fetchSlots();
  };

  const handleActivate = async (id: string) => {
    await authFetch(`/api/oh/${id}/publish`, { method: "PATCH" });
    fetchSlots();
  };

  const handleDelete = async (slot: Slot) => {
    const res = await authFetch(`/api/oh/${slot._id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.bookedBy) {
      window.location.assign(
        `mailto:${data.bookedBy.email}?subject=Slot Cancelled&body=Your booking for ${slot.course} on ${slot.start.split("T")[0]} at ${displayTime(slot.start)} has been cancelled.`,
      );
    }
    fetchSlots();
  };

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="outer-box">
            <div className="outer-header">
              <h3>Create Recurring Slots</h3>
            </div>
            <form className="ms-form" onSubmit={handleCreateRecurring}>
              <div className="ms-form-row">
                <div className="ms-field">
                  <label>Course</label>
                  <div className="ms-field-inline">
                    <span>COMP</span>
                    <input
                      value={rCourse}
                      onChange={(e) =>
                        setRCourse(
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                      placeholder="307"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                <div className="ms-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={rStartDate}
                    onChange={(e) => setRStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="ms-field">
                  <label>Weeks</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={rWeeks}
                    onChange={(e) => setRWeeks(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="ms-add-row">
                <div className="ms-field">
                  <label>Day</label>
                  <select
                    value={rDay}
                    onChange={(e) => setRDay(Number(e.target.value))}
                  >
                    {DAYS.map((label, i) => (
                      <option key={i} value={i}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ms-field">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={rAddTime}
                    onChange={(e) => setRAddTime(e.target.value)}
                  />
                </div>
                <div className="ms-field">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={rAddEndTime}
                    onChange={(e) => setRAddEndTime(e.target.value)}
                  />
                </div>
                <button type="button" className="button" onClick={handleAddTimeSlot}>
                  Add Slot
                </button>
              </div>

              {rTimeSlots.length > 0 && (
                <div className="ms-pills">
                  {rTimeSlots.map((s, i) => (
                    <div key={i} className="button ms-pill">
                      {DAYS[s.day]} {displayTime(s.time)} – {displayTime(s.endTime)}
                      <span
                        className="ms-pill-remove"
                        onClick={() =>
                          setRTimeSlots((prev) =>
                            prev.filter((_, j) => j !== i),
                          )
                        }
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {rError && <p className="ms-feedback-error">{rError}</p>}
              {rSuccess && <p className="ms-feedback-success">{rSuccess}</p>}
              <div>
                <button type="submit" className="button">
                  Create
                </button>
              </div>
            </form>
          </div>

          <div className="outer-box">
            <div className="outer-header">
              <h3>Slots with Me</h3>
            </div>
            {slots.length === 0 && (
              <p style={{ color: "#b9b9b9" }}>No slots yet.</p>
            )}
            {slots.map((slot) => {
              const { month, day } = isoToMonthDay(slot.start);
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
                        {slot.bookedBy
                          ? `${slot.bookedBy.name} · ${slot.course.toUpperCase()}`
                          : slot.course.toUpperCase()}
                      </div>
                      <div className="info">{displayTime(slot.start)} – {displayTime(slot.end)} · {slot.type}</div>
                    </div>
                  </div>
                  <div className="grouped-actions">
                    <select
                      className={`status ms-status-select ${slot.status}`}
                      value={slot.status}
                      disabled={slot.status !== "private"}
                      onChange={() => handleActivate(slot._id)}
                    >
                      <option value="private">Private</option>
                      <option value="active">Active</option>
                      {slot.status === "booked" && (
                        <option value="booked">Booked</option>
                      )}
                    </select>
                    {slot.bookedBy && (
                      <a
                        href={`mailto:${slot.bookedBy.email}`}
                        className="button icon-btn blue"
                        style={{ textDecoration: "none" }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <polyline points="2,4 12,13 22,4" />
                        </svg>
                      </a>
                    )}
                    <button
                      className="button icon-btn red"
                      onClick={() => handleDelete(slot)}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
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

export default ManageSlots;
