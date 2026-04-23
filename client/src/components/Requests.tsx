import "../styles/RowBox.css";
import RequestRow from "../components/RequestRow";
import type { RequestSlot } from "../types";

type Props = { requests: RequestSlot[] };

export default function PendingRequests({ requests }: Props) {
  return (
    <div className="appointments-box">
      <div className="appointments-header">
        <h3>Requests</h3>
        <a href="/requests">View all</a>
      </div>

      {requests.map((request) => (
        <RequestRow key={request._id} request={request} />
      ))}
    </div>
  );
}
