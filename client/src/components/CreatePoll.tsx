import React, { useState } from "react";
import { authFetch } from "../utils/fetch";
import "../styles/CreatePoll.css";

type TimeRange = {
  date: string;
  startTime: string;
  endTime: string;
};

export default function CreatePoll() {
  const [course, setCourse] = useState("");
  const [slots, setSlots] = useState<TimeRange[]>([
    { date: "", startTime: "", endTime: "" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const addRow = () => {
    setSlots([...slots, { date: "", startTime: "", endTime: "" }]);
  };

  const removeRow = (index: number) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  const handleSubmit = async () => {
    const first = slots[0];
    if (!first.date || !first.startTime || !first.endTime) {
      alert("Please fill in the first time slot");
      return;
    }
    if (!course) {
      alert("Please fill in course");
      return;
    }

    for (const slot of slots) {
      if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
        alert("One of your slots has end time before start time");
        return;
      }
    }

    const formattedSlots = slots.map((s) => ({
      start: `${s.date}T${s.startTime}:00`,
      end: `${s.date}T${s.endTime}:00`,
    }));

    try {
      const res = await authFetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          slots: formattedSlots,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to create poll");
        return;
      }

      alert("Poll created!");
      window.dispatchEvent(new Event("poll-updated"));

      setCourse("");
      setSlots([{ date: "", startTime: "", endTime: "" }]);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="poll-box">
      <h3>Create Poll</h3>

      <label>Course</label>
      <input
        type="text"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="COMP 307"
      />

      <div className="poll-slots">
        {slots.map((slot, index) => (
          <div key={index} className="poll-row">
            <input
              type="date"
              value={slot.date}
              onChange={(e) => handleChange(index, "date", e.target.value)}
            />

            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleChange(index, "startTime", e.target.value)}
            />

            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleChange(index, "endTime", e.target.value)}
            />

            {slots.length > 1 && (
              <button onClick={() => removeRow(index)}>−</button>
            )}

            {index === slots.length - 1 && <button onClick={addRow}>+</button>}
          </div>
        ))}
      </div>

      <button className="create-btn" onClick={handleSubmit}>
        Create Poll
      </button>
    </div>
  );
}
