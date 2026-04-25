import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import MySlots from "../components/MySlots";
import type { Slot } from "../types";
import Appointments from "../components/Appointments";
import MySessions from "../components/MySessions";
import { authFetch } from "../utils/fetch";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [createdSlots, setCreatedSlots] = useState<Slot[]>([]);
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
    const booked = await authFetch("/api/slots/booked");
    setBookedSlots(await booked.json());

    if (role === "owner") {
      const created = await authFetch("/api/slots/created");
      setCreatedSlots(await created.json());
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
                      ]
                    : bookedSlots
                }
                currentUserId={user?.id}
                showManageAll={user?.role !== "owner"}
                readonly
              />
            </div>
            <div className="dashboard-right">
              {user?.role === "owner" ? (
                <>
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
