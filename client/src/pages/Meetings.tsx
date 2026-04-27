import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import type { RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";
import { displayTime, isoToMonthDay } from "../utils/time";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";


const Meetings: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as { role: string }) : null;
  const isOwner = user?.role === "owner";

  const [requests, setRequests] = useState<RequestSlot[]>([]);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    const res = await authFetch(isOwner ? "/api/requests/owner" : "/api/requests");
    if (res.ok) setRequests(await res.json());
  }, [isOwner]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (id: string) => {
    await authFetch(`/api/requests/${id}/accept`, { method: "POST" });
    fetchRequests();
  };

  const handleDeny = async (id: string) => {
    await authFetch(`/api/requests/${id}/deny`, { method: "POST" });
    fetchRequests();
  };

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          {!isOwner && (
            <div className="outer-box">
              <div className="outer-header">
                <h3>Request a Meeting</h3>
              </div>
              <button
                className="button blue"
                style={{ width: "100%", height: "48px", fontSize: "16px" }}
                onClick={() => navigate("/staff")}
              >
                Browse Staff
              </button>
            </div>
          )}

          {isOwner && (
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
                    <div className="appointment-info">
                      <div className="title">
                        {req.course.toUpperCase()} · {req.bookedBy.name}
                      </div>
                      <div className="info">
                        {(() => { const { month, day } = isoToMonthDay(req.start); return `${month} ${day}`; })()} at {displayTime(req.start)}
                      </div>
                      {req.message && <div className="info">{req.message}</div>}
                    </div>
                  </div>
                  <div className="grouped-actions">
                    <button className="button green" onClick={() => handleAccept(req._id)}>
                      Accept
                    </button>
                    <button className="button red" onClick={() => handleDeny(req._id)}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Meetings;
