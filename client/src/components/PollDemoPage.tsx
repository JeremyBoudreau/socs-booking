import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/fetch";
import PollVoteRow from "./PollVoteRow";
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

export default function PollDemoPage() {
  const [polls, setPolls] = useState<PollView[]>([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await authFetch("/api/polls");
        const data = await res.json();
        setPolls(data);
      } catch (err) {
        console.error("Failed to load polls", err);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="outer-box">
      <div className="outer-header">
        <h3>All Active Polls</h3>
      </div>

      {polls.length === 0 ? (
        <div style={{ padding: "10px", color: "#999" }}>No polls available</div>
      ) : (
        polls.map((poll) => <PollVoteRow key={poll._id} poll={poll} />)
      )}
    </div>
  );
}
