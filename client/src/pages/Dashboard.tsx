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
import PollManager from "../components/PollManager";
import Requests from "../components/Requests";
import OwnerRequests from "../components/OwnerRequests";
import InviteLinkButton from "../components/InviteLinkButton";
import CreatePoll from "../components/CreatePoll";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";

export const dummyPolls = [
  {
    _id: "poll1",
    course: "COMP 307 - Office Hours",
    slots: [
      {
        id: "slot1",
        start: "2026-04-24T10:00",
        end: "2026-04-24T11:00",
        voteCount: 3,
      },
      {
        id: "slot2",
        start: "2026-04-24T14:00",
        end: "2026-04-24T15:00",
        voteCount: 7,
      },
      {
        id: "slot3",
        start: "2026-04-25T09:00",
        end: "2026-04-25T10:30",
        voteCount: 2,
      },
    ],
  },

  {
    _id: "poll2",
    course: "COMP 251 - Review Session",
    slots: [
      {
        id: "slot4",
        start: "2026-04-26T12:00",
        end: "2026-04-26T13:00",
        voteCount: 5,
      },
      {
        id: "slot5",
        start: "2026-04-26T16:00",
        end: "2026-04-26T17:30",
        voteCount: 9,
      },
    ],
  },

  {
    _id: "poll3",
    course: "COMP 202 - Lab Help",
    slots: [
      {
        id: "slot6",
        start: "2026-04-27T10:00",
        end: "2026-04-27T11:30",
        voteCount: 1,
      },
      {
        id: "slot7",
        start: "2026-04-27T13:00",
        end: "2026-04-27T14:00",
        voteCount: 4,
      },
      {
        id: "slot8",
        start: "2026-04-27T15:00",
        end: "2026-04-27T16:00",
        voteCount: 6,
      },
    ],
  },
];

const dummyRequests: RequestSlot[] = [
  /*{
    
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
  },*/
];

const dummySlots: Slot[] = [
  /*{
    
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
  },*/
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
      <CreatePoll />
      <PollManager polls={dummyPolls} />
      <Footer />
    </div>
  );
};

export default Dashboard;
