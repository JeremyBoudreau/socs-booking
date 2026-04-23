import "../styles/RowBox.css";
import type { Slot } from "../types";

type Props = { slot: Slot };

export default function AppointmentRow(props: Props) {
  const slot = props.slot;
  const date = new Date(slot.date);
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = date.getDate();

  return (
    <div className="appointment-row">
      <div className="appointment-date">
        <div className="month">{month}</div>
        <div className="day">{day}</div>
      </div>

      <div className="appointment-info">
        <div className="title">
          {slot.ownerName} - {slot.type}
        </div>
        <div className="info">{slot.time}</div>
        <div className="info">{slot.course}</div>
      </div>

      <div className="grouped-actions">
        <button className="button blue">✉</button>

        <button className="button red">✕</button>
      </div>
    </div>
  );
}
