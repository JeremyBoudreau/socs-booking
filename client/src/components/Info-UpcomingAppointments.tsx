import "../styles/InfoBox.css"; // (or better: Sidebar.css if you split later)

export default function InfoUpcomingAppointments() {
    return (
        <div className="info-card">
            <div className="info-text">Upcoming</div>
            <div className="info-number">3</div>
            <div className="info-text">appointments</div>
        </div>
    );
}