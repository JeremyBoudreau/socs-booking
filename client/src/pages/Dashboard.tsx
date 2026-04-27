import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MySlots from "../components/MySlots";
import type { Slot, RequestSlot } from "../types";
import Appointments from "../components/Appointments";
import MySessions from "../components/MySessions";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";
import MeetingRequests from "../components/MeetingRequests";

const toSlot = (r: RequestSlot): Slot => ({
  _id: r._id,
  ownerId: r.ownerId,
  ownerName: r.ownerName,
  ownerEmail: r.ownerEmail,
  course: r.course,
  start: r.start,
  end: r.end,
  type: "1-on-1 Meeting",
  status: "booked",
  createdAt: r.createdAt,
  bookedBy: { userId: r.bookedBy.userId, name: r.bookedBy.name, email: r.bookedBy.email },
});

const Dashboard: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [createdSlots, setCreatedSlots] = useState<Slot[]>([]);
  const [confirmedMeetings, setConfirmedMeetings] = useState<Slot[]>([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? (JSON.parse(storedUser) as {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
      })
    : null;

  const role = user?.role;

  const fetchAll = useCallback(async () => {
    const booked = await authFetch("/api/oh/booked");
    setBookedSlots(await booked.json());

    if (role === "owner") {
      const created = await authFetch("/api/oh/created");
      setCreatedSlots(await created.json());
    }

    const reqRes = await authFetch(role === "owner" ? "/api/requests/owner" : "/api/requests");
    if (reqRes.ok) {
      const reqs: RequestSlot[] = await reqRes.json();
      setConfirmedMeetings(reqs.filter((r) => r.status === "confirmed").map(toSlot));
    }
  }, [role]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div
            className="dashboard-main"
            style={user?.role !== "owner" ? { gridTemplateColumns: "1fr" } : {}}
          >
            <div className="dashboard-left">
              <Appointments
                slots={
                  user?.role === "owner"
                    ? [
                        ...createdSlots.filter((s) => s.status === "booked"),
                        ...bookedSlots,
                        ...confirmedMeetings,
                      ]
                    : [...bookedSlots, ...confirmedMeetings]
                }
                currentUserId={user?.id}
                showManageAll={user?.role !== "owner"}
                readonly
              />
            </div>
            <div className="dashboard-right">
              {user?.role === "owner" ? (
                <>
                  <MeetingRequests />
                  <MySlots slots={createdSlots} />
                  <MySessions slots={bookedSlots} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
