import "../styles/RowBox.css";
import type { Slot } from "../types";

type Props = { slots: Slot[] };

export default function MySlots(props: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>My Slots</h3>
        <a href="/slots">Manage all</a>
      </div>

      {props.slots.map((slot) => {
        const date = new Date(slot.date);
        const day = date.toLocaleString("default", { weekday: "short" });

        return (
          <div key={slot._id} className="inner-row">
            <div className="appointment-info">
              <div className="title">
                {slot.type} | {day} {slot.time}
              </div>

              <div className="info">{slot.course}</div>
            </div>

            <div className={`status ${slot.status}`}>{slot.status}</div>
            <div className="grouped-actions">
              <button className="button blue">Edit</button>
              <button className="button red">✕</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
