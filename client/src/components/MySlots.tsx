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
        const startDate = new Date(slot.start);
        const endDate = new Date(slot.end);

        const day = startDate.toLocaleString("default", { weekday: "short" });

        const startTime = startDate.toTimeString().slice(0, 5);
        const endTime = endDate.toTimeString().slice(0, 5);

        return (
          <div key={slot._id} className="inner-row">
            <div className="appointment-info">
              <div className="title">
                {slot.type} | {day} {startTime} - {endTime}
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
