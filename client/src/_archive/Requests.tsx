import "../styles/RowBox.css";
import RequestRow from "../components/RequestRow";
import type { RequestSlot } from "../types";

type Props = { requests: RequestSlot[] };

export default function PendingRequests({ requests }: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Booking Requests</h3>
        <a href="/staff">Book Appointment</a>
      </div>

      {requests.map((request) => (
        <RequestRow key={request._id} request={request} />
      ))}
    </div>
  );
}
