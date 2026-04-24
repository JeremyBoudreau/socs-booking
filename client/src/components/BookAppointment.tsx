import { useNavigate } from "react-router-dom";
import "../styles/RowBox.css";

export default function BookAppointment() {
  const navigate = useNavigate();

  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Book Appointment</h3>
      </div>
      <p style={{ color: "#9a9a9a", marginBottom: "16px" }}>
        Browse available staff and reserve a slot.
      </p>
      <button className="button blue" style={{ width: "100%", height: "48px", fontSize: "16px" }} onClick={() => navigate("/staff")}>
        Browse Staff
      </button>
    </div>
  );
}
