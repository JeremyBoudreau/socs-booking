import "../styles/InfoBox.css"; // (or better: Sidebar.css if you split later)

export default function InfoConfirmed() {
    return (
        <div className="info-card">
            <div className="info-text">This week</div>
            <div className="info-number">1</div>
            <div className="info-text">confirmed</div>
        </div>
    );
}