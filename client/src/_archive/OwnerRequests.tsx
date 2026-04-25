import "../styles/RowBox.css";
import OwnerRequestRow from "../components/OwnerRequestRow";
import type { RequestSlot } from "../types";

type Props = { requests: RequestSlot[] };

export default function PendingRequests({ requests }: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Requests for Me</h3>
      </div>

      {requests.length === 0 && (
        <p style={{ color: "#b9b9b9" }}>No requests for me.</p>
      )}
      {requests.map((request) => (
        <OwnerRequestRow key={request._id} request={request} />
      ))}
    </div>
  );
}
