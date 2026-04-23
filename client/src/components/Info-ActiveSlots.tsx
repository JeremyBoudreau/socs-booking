import "../styles/InfoBox.css"; // (or better: Sidebar.css if you split later)

type Props = {
  count: number;
};

export default function InfoActiveSlots({ count }: Props) {
  return (
    <div className="info-card">
      <div className="info-text">Active slots</div>
      <div className="info-number">{count}</div>
      <div className="info-text">this week</div>
    </div>
  );
}
