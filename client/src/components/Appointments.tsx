import "../styles/Appointment.css";
import AppointmentRow from "../components/AppointmentRow";
import type { Slot } from "../types";

type Props = { slots: Slot[] };

export default function Appointments(props: Props) {
    return (
        <div className="appointments-box">
            <div className="appointments-header">
                <h3>Upcoming Appointments</h3>
                <a href="/appointments">View all</a>
            </div>
            {props.slots.map((slot) => (
                <AppointmentRow key={slot._id} slot={slot} />
            ))}
        </div>
    );
}