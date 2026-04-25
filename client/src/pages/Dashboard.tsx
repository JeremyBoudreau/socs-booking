import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StudentSidebar from "../components/StudentSidebar";
import InfoUpcomingAppointments from "../components/Info-UpcomingAppointments";
import MySlots from "../components/MySlots";
import InfoActiveSlots from "../components/Info-ActiveSlots";
import InfoPendingRequests from "../components/Info-PendingRequests";
import InfoConfirmed from "../components/Info-Confirmed";
import Appointments from "../components/Appointments";
import Calendar from "../components/Calendar";
import PollManager from "../components/PollManager";
import Requests from "../components/Requests";
import OwnerRequests from "../components/OwnerRequests";
import InviteLinkButton from "../components/InviteLinkButton";
import CreatePoll from "../components/CreatePoll";
import PollDemoPage from "../components/PollDemoPage";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";

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
      <Requests requests={[]} />
      <OwnerRequests requests={[]} />
      <InfoActiveSlots count={3} />
      <MySlots slots={[]} />
      <InviteLinkButton />
      <CreatePoll />
      <PollManager />
      <PollDemoPage />
      <Footer />
    </div>
  );
};

export default Dashboard;
