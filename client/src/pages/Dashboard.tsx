import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import InfoUpcomingAppointments from "../components/Info-UpcomingAppointments";
import InfoPendingRequests from "../components/Info-PendingRequests";
import InfoConfirmed from "../components/Info-Confirmed";
import Appointments from "../components/Appointments";
import Calendar from "../components/Calendar";

const Dashboard: React.FC = () => {
  return (
    <div className="user-page">
      <div className="user-container">
        <Navbar />
        <main>
          <Sidebar />
          <InfoUpcomingAppointments />
          <InfoPendingRequests />
          <InfoConfirmed />
          <Appointments />
          <Calendar />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
