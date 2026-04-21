import "../styles/Appointment.css";
import AppointmentRow from "../components/AppointmentRow";

export default function Appointments() {
    return (
        <div className="appointments-box">
            <div className="appointments-header">
                <h3>Upcoming Appointments</h3>
                <a href="/appointments">View all →</a>
            </div>

            <AppointmentRow />
            <AppointmentRow />
            <AppointmentRow />
        </div>
    );
}