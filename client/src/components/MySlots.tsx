import "../styles/RowBox.css";
import type { Slot } from "../types";
import { displayTime, isoToMonthDay } from "../utils/time";
import InviteLinkButton from "./InviteLinkButton";

type Props = { slots: Slot[] };

export default function MySlots(props: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Office Hours</h3>
        <a href="/oh">Manage all</a>
      </div>
      {props.slots.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No slots yet.</p>
      )}
      {props.slots.map((slot) => {
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
                  {slot.course.toUpperCase()}
                </div>
                <div className="info">{displayTime(slot.start)} to {displayTime(slot.end)}</div>
              </div>
            </div>
            <div className={`status ${slot.status}`}>{slot.status}</div>
          </div>
        );
      })}
      <InviteLinkButton />
    </div>
  );
}
