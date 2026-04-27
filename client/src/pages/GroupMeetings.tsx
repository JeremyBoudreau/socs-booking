import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import PollManager from "../components/PollManager";
import CreatePoll from "../components/CreatePoll";
import "../styles/Dashboard.css";
import "../styles/RowBox.css";

const GroupMeetings: React.FC = () => {
  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <CreatePoll />
          <PollManager />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GroupMeetings;
