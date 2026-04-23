import "../styles/RowBox.css";
import AppointmentRow from "../components/AppointmentRow";
import type { Slot } from "../types";

type Props = { slots: Slot[] };

const dummySlot: Slot = {
  _id: "1",
  ownerId: "owner123",
  ownerEmail: "owner@example.com",
  ownerName: "Owner",
  course: "COMP 307",
  date: "2026-04-25",
  time: "14:00",
  type: "office-hours",
  status: "booked",
  bookedBy: {
    userId: "user456",
    name: "John Doe",
    email: "john@example.com",
  },
  createdAt: new Date().toISOString(),
};

export default function Appointments(props: Props) {
  return (
    <div className="appointments-box">
      <div className="appointments-header">
        <h3>Upcoming Appointments</h3>
        <a href="/appointments">View all</a>
      </div>
      {props.slots.map((slot) => (
        <AppointmentRow key={slot._id} slot={slot} />
      ))}

      <AppointmentRow key={dummySlot._id} slot={dummySlot} />
      <AppointmentRow key={dummySlot._id} slot={dummySlot} />
      <AppointmentRow key={dummySlot._id} slot={dummySlot} />
    </div>
  );
}
