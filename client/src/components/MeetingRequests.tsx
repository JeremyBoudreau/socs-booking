// Samara
import { useEffect, useState } from "react";
import type { RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";
import { displayTime, isoToMonthDay } from "../utils/time";
import "../styles/RowBox.css";

const MeetingRequests = () => {
  const [requests, setRequests] = useState<RequestSlot[]>([]);

  useEffect(() => {
    authFetch("/api/requests/owner")
      .then((r) => r.json())
      .then((data: RequestSlot[]) =>
        setRequests(data.filter((r) => r.status === "pending")),
      );
  }, []);

  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>One-on-One Requests</h3>
        <a href="/meetings">Manage all</a>
      </div>

      {requests.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No meeting requests.</p>
      )}

      {requests.map((request) => {
        const { month, day } = isoToMonthDay(request.start);
        return (
          <div className="slot-row" key={request._id}>
            <div className="row-left">
              <div className="slot-row-date">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>
              <div className="appointment-info" style={{ marginLeft: "12px" }}>
                <div className="title">
                  {request.bookedBy.name} · {request.course.toUpperCase()}
                </div>
                <div className="info">
                  {displayTime(request.start)} to {displayTime(request.end)}
                </div>
                {request.message && (
                  <div className="info">{request.message}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingRequests;
