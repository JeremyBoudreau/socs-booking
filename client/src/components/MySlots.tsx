import "../styles/RowBox.css";
import type { Slot } from "../types";
import InviteLinkButton from "./InviteLinkButton";

type Props = { slots: Slot[] };

export default function MySlots(props: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Slots with Me</h3>
        <a href="/slots">Manage all</a>
      </div>
      {props.slots.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No slots yet.</p>
      )}
      {props.slots.map((slot) => {
        const date = new Date(slot.date);
        const month = date
          .toLocaleString("default", { month: "short" })
          .toUpperCase();
        const day = date.getDate();

        return (
          <div key={slot._id} className="slot-row">
            <div className="row-left">
              <div className="slot-row-date">
                <span className="month">{month}</span>
                <span className="day">{day}</span>
              </div>
              <div className="appointment-info" style={{ marginLeft: "12px" }}>
                <div className="title">
                  {slot.course.toUpperCase()} · {slot.type}
                </div>
                <div className="info">{slot.time}</div>
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
