import "../styles/Appointment.css";

export default function AppointmentRow() {
    return (
        <div className="appointment-row">
            <div className="appointment-date">
                <div className="month">OCT</div>
                <div className="day">24</div>
            </div>

            <div className="appointment-info">
                <div className="title">Prof. Foo - Office Hours</div>
                <div className="info">10:00 - 10:30</div>
                <div className="info">Leacock 132</div>
            </div>

            <button className="appointment-action">
                ✕
            </button>
        </div>
    );
}