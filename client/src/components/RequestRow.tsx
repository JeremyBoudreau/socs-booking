import "../styles/RowBox.css";
import type { RequestSlot } from "../types";
import { authFetch } from "../utils/fetch";

type Props = { request: RequestSlot };

export default function RequestRow({ request }: Props) {
  let initials = "";
  const isPending = request.status === "pending";

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
    <div className="inner-row">
      <div className="row-left">
        <div className="navbar-icon">{initials}</div>

        <div className="inner-info">
          <div className="title">{request.ownerName}</div>
          <div className="info message">{request.message}</div>
        </div>
      </div>

      <div className="row-right">
        <div className={`status ${request.status}`}>{request.status}</div>
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
    </div>
  );
}
