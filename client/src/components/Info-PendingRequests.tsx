import "../styles/InfoBox.css"; // (or better: Sidebar.css if you split later)

export default function InfoPendingRequests() {
    return (
        <div className="info-card">
            <div className="info-text">Requests</div>
            <div className="info-number">2</div>
            <div className="info-text">pending</div>
        </div>
    );
}