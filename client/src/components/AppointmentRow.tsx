import "../styles/RowBox.css";
import type { Slot } from "../types";

type Props = {
  slot: Slot;
  currentUserId?: string;
  onCancel?: (slot: Slot) => void;
  readonly?: boolean;
};

export default function AppointmentRow({
  slot,
  currentUserId,
  onCancel,
  readonly,
}: Props) {
  const date = new Date(slot.date);
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = date.getDate();

  const isHost = slot.ownerId === currentUserId;
  const personName = isHost ? (slot.bookedBy?.name ?? "") : slot.ownerName;

  return (
    <div className="inner-row">
      <div className="row-left">
        <div className="appointment-date">
          <div className="month">{month}</div>
          <div className="day">{day}</div>
        </div>
        <div className="appointment-info">
          <div className="title">
            {personName} · {slot.course.toUpperCase()}
          </div>
          <div className="info">
            {slot.time} · {slot.type}
          </div>
        </div>
      </div>

      {!isHost && !readonly && (
        <div className="grouped-actions">
          <a
            href={`mailto:${slot.ownerEmail}`}
            className="button icon-btn blue"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </a>
          {onCancel && (
            <button
              className="button icon-btn red"
              onClick={() => onCancel(slot)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
