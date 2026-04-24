import "../styles/RowBox.css";
import type { Slot } from "../types";
import { formatTime } from "../utils/time";

type Props = { slot: Slot };

export default function AppointmentRow(props: Props) {
  const slot = props.slot;
  const date = new Date(slot.date);
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = date.getDate();

  return (
    <div className="inner-row">
      <div className="row-left">
        <div className="appointment-date">
          <div className="month">{month}</div>
          <div className="day">{day}</div>
        </div>

        <div className="appointment-info">
          <div className="title">{slot.ownerName} · {slot.course.toUpperCase()}</div>
          <div className="info">{formatTime(slot.time)} · {slot.type}</div>
        </div>
      </div>

      <div className="grouped-actions">
        <button className="button blue">✉</button>

        <button className="button red"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
      </div>
    </div>
  );
}
