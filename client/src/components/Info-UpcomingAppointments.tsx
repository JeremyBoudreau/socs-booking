import "../styles/InfoBox.css"; // (or better: Sidebar.css if you split later)

type Props = {
  count: number;
};

export default function InfoUpcomingAppointments({ count }: Props) {
  return (
    <div className="info-card">
      <div className="info-text">Upcoming</div>
      <div className="info-number">{count}</div>
      <div className="info-text">appointments</div>
    </div>
  );
}
