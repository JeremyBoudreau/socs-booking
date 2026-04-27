import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/fetch";
import PollVoteRow from "./PollVoteRow";
import "../styles/RowBox.css";
import { useParams } from "react-router-dom";

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
  const { ownerId } = useParams<{ ownerId: string }>();

  useEffect(() => {
    if (!ownerId) return;

    const fetchPolls = async () => {
      try {
        const res = await authFetch(`/api/polls?ownerId=${ownerId}`);
        const data = await res.json();
        setPolls(data);
      } catch (err) {
        console.error("Failed to load polls", err);
      }
    };

    fetchPolls();
  }, [ownerId]);

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
