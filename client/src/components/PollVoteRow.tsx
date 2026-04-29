// Jeremy
import { useState } from "react";
import "../styles/RowBox.css";
import { authFetch } from "../utils/fetch";

type PollSlotView = {
  id: string;
  start: string;
  end: string;
  voteCount: number;
};

type PollView = {
  _id: string;
  course: string;
  slots: PollSlotView[];
};

type Props = {
  poll: PollView;
};

export default function PollVoteRow({ poll }: Props) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const toggleSlot = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    );
  };

  const formatSlot = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);

    const day = String(s.getDate()).padStart(2, "0");
    const month = String(s.getMonth() + 1).padStart(2, "0");

    return `${day}/${month} | ${s.toTimeString().slice(0, 5)} - ${e
      .toTimeString()
      .slice(0, 5)}`;
  };

  const submitVote = async () => {
    if (selectedSlots.length === 0) {
      alert("Select at least one time slot");
      return;
    }

    const res = await authFetch(`/api/polls/${poll._id}/vote`, {
      method: "POST",
      body: JSON.stringify({
        slotIds: selectedSlots,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to submit vote");
      return;
    }

    alert("Vote submitted!");
    setSelectedSlots([]);
  };

  return (
    <div className="inner-row">
      <div className="row-left">
        <div className="appointment-info">
          <div className="title">{poll.course}</div>

          {poll.slots.map((slot) => (
            <label key={slot.id} className="poll-checkbox-row">
              <input
                type="checkbox"
                checked={selectedSlots.includes(slot.id)}
                onChange={() => toggleSlot(slot.id)}
              />
              <span>
                {formatSlot(slot.start, slot.end)} ({slot.voteCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="row-right">
        <button className="button green" onClick={submitVote}>
          ✔
        </button>
      </div>
    </div>
  );
}
