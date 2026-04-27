import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import type { Slot, RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";
import { displayTime, isoToMonthDay } from "../utils/time";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

const capitalize = (name: string) => {
  if (!name) return "";
  name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const MailIcon = () => (
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
);

const TrashIcon = () => (
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
);

const DateBadge = ({ dateStr }: { dateStr: string }) => {
  const { month, day } = isoToMonthDay(dateStr);
  return (
    <div className="slot-row-date">
      <span className="month">
        {date.toLocaleString("default", { month: "short" }).toUpperCase()}
      </span>
      <span className="day">{date.getDate()}</span>
    </div>
  );
};

const ManageAppointments: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [requests, setRequests] = useState<RequestSlot[]>([]);
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    const slotsRes = await authFetch("/api/oh/booked");
    setBookedSlots(await slotsRes.json());

    const reqRes = await authFetch("/api/requests");
    if (reqRes.ok) setRequests(await reqRes.json());
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCancelMeeting = async (req: RequestSlot) => {
    const res = await authFetch(`/api/requests/${req._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ownerEmail) {
      window.location.assign(
        `mailto:${data.ownerEmail}?subject=Meeting Cancelled&body=Hi, I have cancelled my meeting request for ${req.course} on ${req.start.split("T")[0]} at ${displayTime(req.start)}.`,
      );
    }
    fetchAll();
  };

  const handleCancel = async (slot: Slot) => {
    const res = await authFetch(`/api/oh/${slot._id}/book`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.ownerEmail) {
      window.location.assign(
        `mailto:${data.ownerEmail}?subject=Booking Cancelled&body=Hi, I have cancelled my booking for ${slot.course} on ${slot.start.split("T")[0]} at ${displayTime(slot.start)}.`,
      );
    }
    fetchAll();
  };

  const pending = requests.filter((r) => r.status === "pending");
  const confirmed = requests.filter((r) => r.status === "confirmed");
  const totalAppointments = bookedSlots.length + confirmed.length;

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="outer-box">
            <div className="outer-header">
              <h3>Book an Appointment</h3>
            </div>
            <button
              className="button blue"
              style={{ width: "100%", height: "48px", fontSize: "16px" }}
              onClick={() => navigate("/staff")}
            >
              Browse Staff
            </button>
          </div>

          <div className="outer-box">
            <div className="outer-header">
              <h3>My Appointments</h3>
            </div>
            {totalAppointments === 0 && (
              <p style={{ color: "#b9b9b9" }}>No booked appointments.</p>
            )}
            {bookedSlots.map((slot) => (
              <div key={slot._id} className="slot-row">
                <div className="row-left">
                  <DateBadge dateStr={slot.start} />
                  <div className="appointment-info" style={{ marginLeft: "12px" }}>
                    <div className="title">
                      {capitalize(slot.ownerName)} · {slot.course.toUpperCase()}
                    </div>
                    <div className="info">{displayTime(slot.start)} to {displayTime(slot.end)} · {slot.type}</div>
                  </div>
                </div>
                <div className="grouped-actions">
                  <a
                    href={`mailto:${slot.ownerEmail}`}
                    className="button icon-btn blue"
                    style={{ textDecoration: "none" }}
                  >
                    <MailIcon />
                  </a>
                  <button
                    className="button icon-btn red"
                    onClick={() => handleCancel(slot)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
            {confirmed.map((req) => (
              <div key={req._id} className="slot-row">
                <div className="row-left">
                  <DateBadge dateStr={req.start} />
                  <div className="appointment-info" style={{ marginLeft: "12px" }}>
                    <div className="title">
                      {capitalize(req.ownerName)} · {req.course.toUpperCase()}
                    </div>
                    <div className="info">{displayTime(req.start)} to {displayTime(req.end)} · 1-on-1 Meeting</div>
                  </div>
                </div>
                <div className="grouped-actions">
                  <a
                    href={`mailto:${req.ownerEmail}`}
                    className="button icon-btn blue"
                    style={{ textDecoration: "none" }}
                  >
                    <MailIcon />
                  </a>
                  <button
                    className="button icon-btn red"
                    onClick={() => handleCancelMeeting(req)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="outer-box">
            <div className="outer-header">
              <h3>Pending Requests</h3>
            </div>
            {pending.length === 0 && (
              <p style={{ color: "#b9b9b9" }}>No pending requests.</p>
            )}
            {pending.map((req) => (
              <div key={req._id} className="slot-row">
                <div className="row-left">
                  <DateBadge dateStr={req.start} />
                  <div className="appointment-info" style={{ marginLeft: "12px" }}>
                    <div className="title">
                      {req.ownerName} · {req.course.toUpperCase()}
                    </div>
                    <div className="info">{displayTime(req.start)} to {displayTime(req.end)} · 1-on-1 Meeting</div>
                    {req.message && <div className="info">{req.message}</div>}
                  </div>
                </div>
                <div className="grouped-actions">
                  <div className={`status ${req.status}`}>{req.status}</div>
                  <a
                    href={`mailto:${req.ownerEmail}`}
                    className="button icon-btn blue"
                    style={{ textDecoration: "none" }}
                  >
                    <MailIcon />
                  </a>
                  <button className="button icon-btn red" onClick={() => handleCancelMeeting(req)}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAppointments;
