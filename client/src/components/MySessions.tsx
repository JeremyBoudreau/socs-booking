import "../styles/RowBox.css";
import type { Slot } from "../types";
import { displayTime, isoToMonthDay } from "../utils/time";

type Props = { slots: Slot[] };

export default function MySessions({ slots }: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>My appointments</h3>
        <a href="/appointments">Manage all</a>
      </div>

      {slots.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No booked appointments.</p>
      )}
      {slots.map((slot) => {
        const { month, day } = isoToMonthDay(slot.start);
        return (
          <div key={slot._id} className="slot-row">
            <div className="row-left">
              <div className="slot-row-date">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>
              <div className="appointment-info" style={{ marginLeft: "12px" }}>
                <div className="title">
                  {slot.ownerName} · {slot.course.toUpperCase()}
                </div>
                <div className="info">{displayTime(slot.start)} to {displayTime(slot.end)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
