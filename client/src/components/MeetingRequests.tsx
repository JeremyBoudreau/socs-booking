import { useEffect, useState } from "react";
import type { RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";
import { displayTime, isoToMonthDay } from "../utils/time";
import "../styles/RowBox.css";

type Input = {
  onChange: () => void;
};

const MeetingRequests = ({ onChange }: Input) => {
  const [requests, setRequests] = useState<RequestSlot[]>([]);

  const fetchRequests = async () => {
    const res = await authFetch("/api/requests/owner");
    const data = await res.json();

    setRequests(
      data.filter((request: RequestSlot) => request.status === "pending")
    );
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (id: string) => {
    await authFetch(`/api/requests/${id}/accept`, {
      method: "POST",
    });

    fetchRequests();
    onChange();
  };

  const denyRequest = async (id: string) => {
    await authFetch(`/api/requests/${id}/deny`, {
      method: "POST",
    });

    fetchRequests();
  };

  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>One-on-One Meetings</h3>
        <a href="/meetings">Manage all</a>
      </div>

      {requests.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No meeting requests.</p>
      )}

      {requests.map((request) => (
        <div className="slot-row" key={request._id}>
          <div className="row-left">
            <div className="appointment-info">
              <div className="title">
                {request.course.toUpperCase()} · {request.bookedBy.name}
              </div>
              <div className="info">
                {(() => { const { month, day } = isoToMonthDay(request.start); return `${month} ${day}`; })()} at {displayTime(request.start)}
              </div>
              <div className="info">{request.message}</div>
            </div>
          </div>

          <div className="grouped-actions">
            <button
              className="button green"
              onClick={() => acceptRequest(request._id)}
            >
              Accept
            </button>

            <button
              className="button red"
              onClick={() => denyRequest(request._id)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingRequests;