import "../styles/RowBox.css";
import type { RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";

type Props = { request: RequestSlot };

export default function RequestRow({ request }: Props) {
  let initials = "";
  const isPending = request.status === "Pending";

  if (request.ownerName) {
    const parts = request.ownerName.split(" ");
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase();
    }
  }

  const handleAction = async () => {
    if (isPending) {
      await authFetch(`/api/requests/${request._id}/deny`, {
        method: "PATCH",
      });
    } else {
      await authFetch(`/api/requests/${request._id}/clear`, {
        method: "PATCH",
      });
    }
  };

  return (
    <div className="appointment-row">
      <div className="navbar-icon">{initials}</div>

      <div className="appointment-info">
        <div className="title">
          {request.ownerName} | {request.status}
        </div>
        <div className="info message">{request.message}</div>
      </div>

      <div className="grouped-actions">
        <button className="button blue">✉</button>

        <button
          onClick={handleAction}
          className={isPending ? "button red" : "button green"}
        >
          {isPending ? "✕" : "✓"}
        </button>
      </div>
    </div>
  );
}
