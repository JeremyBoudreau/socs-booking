import "../styles/RowBox.css";
import type { RequestSlot } from "../types";

type Props = { request: RequestSlot };

export default function OwnerRequestRow({ request }: Props) {
  let initials = "";

  if (request.createdBy.name) {
    const parts = request.createdBy.name.split(" ");
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase();
    }
  }

  return (
    <div className="inner-row">
      <div className="row-left">
        <div className="navbar-icon">{initials}</div>

        <div className="inner-info">
          <div className="title">{request.createdBy.name}</div>
          <div className="info message">{request.message}</div>
        </div>
      </div>

      <div className="grouped-actions">
        <button className="button blue">✉</button>
        <button className={"button green"}>✓</button>
        <button className={"button red"}>✕</button>
      </div>
    </div>
  );
}
