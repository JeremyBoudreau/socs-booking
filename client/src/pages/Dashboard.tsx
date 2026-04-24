import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StudentSidebar from "../components/StudentSidebar";
import InfoUpcomingAppointments from "../components/Info-UpcomingAppointments";
import MySlots from "../components/MySlots";
import InfoActiveSlots from "../components/Info-ActiveSlots";
import type { RequestSlot } from "../types";
import type { Slot } from "../types";
import InfoPendingRequests from "../components/Info-PendingRequests";
import InfoConfirmed from "../components/Info-Confirmed";
import Appointments from "../components/Appointments";
import Calendar from "../components/Calendar";
import Requests from "../components/Requests";
import OwnerRequests from "../components/OwnerRequests";
import InviteLinkButton from "../components/InviteLinkButton";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";

const dummyRequests: RequestSlot[] = [
  {
    _id: "req1",
    ownerId: "owner123",
    ownerName: "Alice Smith",
    ownerEmail: "alice@example.com",
    course: "COMP 307",
    date: "2026-04-25",
    time: "14:00",
    type: "office-hours",
    status: "pending",
    createdBy: {
      userId: "user456",
      name: "John Doe",
      email: "john@example.com",
    },
    createdAt: new Date().toISOString(),
    message:
      "Hi, I’m having trouble understanding the last assignment. Could we go over the reduction step together?",
  },
  {
    _id: "req2",
    ownerId: "owner124",
    ownerName: "Bob Lee",
    ownerEmail: "bob@example.com",
    course: "COMP 251",
    date: "2026-04-26",
    time: "10:00",
    type: "review",
    status: "confirmed",
    createdBy: {
      userId: "user789",
      name: "Emma Brown",
      email: "emma@example.com",
    },
    createdAt: new Date().toISOString(),
    message:
      "Could you help me review dynamic programming? I want to make sure I'm ready for the midterm.",
  },
];

const dummySlots: Slot[] = [
  {
    _id: "slot1",
    ownerId: "owner123",
    ownerName: "Prof. Smith",
    ownerEmail: "smith@mcgill.ca",
    course: "COMP 307",
    date: "2026-04-25",
    time: "10:00-11:00",
    type: "Recurring",
    status: "active",
    bookedBy: null,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "slot2",
    ownerId: "owner123",
    ownerName: "Prof. Smith",
    ownerEmail: "smith@mcgill.ca",
    course: "COMP 307",
    date: "2026-04-26",
    time: "14:00-15:00",
    type: "Single",
    status: "booked",
    bookedBy: {
      userId: "user456",
      name: "John Doe",
      email: "john@example.com",
    },
    createdAt: new Date().toISOString(),
  },
];

const Dashboard: React.FC = () => {
  const [slots, setSlots] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? (JSON.parse(storedUser) as {
        firstName: string;
        lastName: string;
        role: string;
      })
    : null;

  useEffect(() => {
    const fetchSlots = async () => {
      const endpoint =
        user?.role === "owner" ? "/api/slots/created" : "/api/slots/booked";
      const res = await authFetch(endpoint);
      const data = await res.json();
      setSlots(data);
    };
    fetchSlots();
  }, []);

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <StudentSidebar />
        <div className="dashboard-content">
          <div className="dashboard-info">
            <InfoUpcomingAppointments count={3} />
            <InfoPendingRequests count={2} />
            <InfoConfirmed count={1} />
          </div>
          <div className="dashboard-main">
            <Appointments slots={slots} />
            <Calendar />
          </div>
        </div>
      </div>
      <Requests requests={dummyRequests} />
      <OwnerRequests requests={dummyRequests} />
      <InfoActiveSlots count={3} />
      <MySlots slots={dummySlots} />
      <InviteLinkButton />
      <Footer />
    </div>
  );
};

export default Dashboard;
