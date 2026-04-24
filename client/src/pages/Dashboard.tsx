import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MySlots from "../components/MySlots";
import type { Slot } from "../types";
import Appointments from "../components/Appointments";
import Calendar from "../components/Calendar";
import BookAppointment from "../components/BookAppointment";
import AppointmentRequests from "../components/AppointmentRequests";
import OwnerRequests from "../components/OwnerRequests";
import InviteLinkButton from "../components/InviteLinkButton";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";


const Dashboard: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [createdSlots, setCreatedSlots] = useState<Slot[]>([]);
  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? (JSON.parse(storedUser) as {
      firstName: string;
      lastName: string;
      role: string;
    })
    : null;

  useEffect(() => {
    const fetchAll = async () => {
      const booked = await authFetch("/api/slots/booked");
      setBookedSlots(await booked.json());

      if (user?.role === "owner") {
        const created = await authFetch("/api/slots/created");
        setCreatedSlots(await created.json());
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="user-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="dashboard-main">
            <div className="dashboard-left">
              <Appointments slots={bookedSlots} />
              {user?.role === "owner" ? (
                <OwnerRequests requests={[]} />
              ) : (
                <AppointmentRequests requests={[]} />
              )}
            </div>
            <div className="dashboard-right">
              <Calendar />
              {user?.role === "owner" ? (
                <>
                  <MySlots slots={createdSlots} />
                  <InviteLinkButton />
                </>
              ) : (
                <BookAppointment />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
