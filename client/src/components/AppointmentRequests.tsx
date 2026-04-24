import "../styles/RowBox.css";
import RequestRow from "../components/RequestRow";
import type { RequestSlot } from "../types";

type Props = { requests: RequestSlot[] };

export default function AppointmentRequests({ requests }: Props) {
  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Booking Requests</h3>
      </div>
      {requests.length === 0 && <p style={{ color: "#b9b9b9" }}>No appointment requests.</p>}
      {requests.map((request) => (
        <RequestRow key={request._id} request={request} />
      ))}
    </div>
  );
}
