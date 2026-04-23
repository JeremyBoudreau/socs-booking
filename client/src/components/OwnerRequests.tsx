import "../styles/RowBox.css";
import OwnerRequestRow from "../components/OwnerRequestRow";
import type { RequestSlot } from "../types";

type Props = { requests: RequestSlot[] };

export default function PendingRequests({ requests }: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Pending Requests</h3>
        <a href="/requests">View all</a>
      </div>

      {requests.map((request) => (
        <OwnerRequestRow key={request._id} request={request} />
      ))}
    </div>
  );
}
