import React, { useState, useEffect } from "react";
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

export default function PollManager() {
  const [polls, setPolls] = useState<PollView[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  useEffect(() => {
    const fetchPolls = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser
        ? (JSON.parse(storedUser) as {
            id: string;
            firstName: string;
            lastName: string;
            role: string;
          })
        : null;

      if (!user) return;

      const res = await authFetch(
        `http://localhost:3000/api/polls?ownerId=${user.id}`,
      );

      const data = await res.json();
      setPolls(data);
    };

    fetchPolls();

    window.addEventListener("poll-updated", fetchPolls);

    return () => window.removeEventListener("poll-updated", fetchPolls);
  }, []);

  const [recurring, setRecurring] = useState<Record<string, boolean>>({});
  const [weeks, setWeeks] = useState<Record<string, number>>({});

  const handleConfirm = async (pollId: string) => {
    const slotId = selected[pollId];

    if (!slotId) {
      alert("Please select a time slot");
      return;
    }

    if (recurring[pollId] && !weeks[pollId]) {
      alert("Please enter number of weeks");
      return;
    }

    await authFetch(`http://localhost:3000/api/polls/${pollId}/finalize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId,
        recurring: recurring[pollId] || false,
        weeks: recurring[pollId] ? weeks[pollId] || 1 : 0,
      }),
    });

    setPolls((prev) => prev.filter((p) => p._id !== pollId));

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
              <div className="recurring-row">
                <label>
                  <input
                    type="checkbox"
                    checked={recurring[poll._id] || false}
                    onChange={(e) =>
                      setRecurring({
                        ...recurring,
                        [poll._id]: e.target.checked,
                      })
                    }
                  />{" "}
                  Recurring?
                </label>

                {recurring[poll._id] && (
                  <input
                    type="number"
                    min={1}
                    placeholder="Weeks After"
                    value={weeks[poll._id] || ""}
                    onChange={(e) =>
                      setWeeks({
                        ...weeks,
                        [poll._id]: Number(e.target.value),
                      })
                    }
                    className="recurring-input"
                  />
                )}
              </div>
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
