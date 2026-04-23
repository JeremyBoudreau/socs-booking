import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import InfoUpcomingAppointments from "../components/Info-UpcomingAppointments";
import InfoPendingRequests from "../components/Info-PendingRequests";
import InfoConfirmed from "../components/Info-Confirmed";
import Appointments from "../components/Appointments";
import Calendar from "../components/Calendar";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [slots, setSlots] = useState([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) as { firstName: string; lastName: string; role: string } : null;


  useEffect(() => {
    const fetchSlots = async () => {
      const endpoint = user?.role === "owner" ? "/api/slots/created" : "/api/slots/booked";
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
          <Sidebar />
          <div className="dashboard-content">
            <div className="dashboard-info">
              <InfoUpcomingAppointments />
              <InfoPendingRequests />
              <InfoConfirmed />
            </div>
            <div className="dashboard-main">
              <Appointments slots={slots} />
              <Calendar />
            </div>
          </div>
        </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
