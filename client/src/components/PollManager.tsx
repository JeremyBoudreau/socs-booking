import React, { useState } from "react";
import "../styles/RowBox.css";

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
  polls: PollView[];
};

export default function PollManager({ polls }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleConfirm = async (pollId: string) => {
    const slotId = selected[pollId];

    if (!slotId) {
      alert("Please select a time slot");
      return;
    }

    await fetch(`/api/polls/${pollId}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });

    alert("Poll finalized!");
  };

  const formatSlotTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const day = String(startDate.getDate()).padStart(2, "0");
    const month = String(startDate.getMonth() + 1).padStart(2, "0");

    const startTime = startDate.toTimeString().slice(0, 5); // HH:MM
    const endTime = endDate.toTimeString().slice(0, 5);

    return `${day}/${month} | ${startTime} - ${endTime}`;
  };

  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>Active Polls</h3>
      </div>

      {polls.map((poll) => (
        <div key={poll._id} className="inner-row">
          <div className="row-left">
            <div className="appointment-info">
              <div className="title">{poll.course}</div>

              <select
                className="poll-dropdown"
                value={selected[poll._id] || ""}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    [poll._id]: e.target.value,
                  })
                }
              >
                <option value="">Select time slot</option>

                {poll.slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatSlotTime(slot.start, slot.end)} | ({slot.voteCount})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row-right">
            <button
              className="button green"
              onClick={() => handleConfirm(poll._id)}
            >
              ✔
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
