import { useState } from "react";
import "../styles/RowBox.css";

export default function InviteLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) as { userId: string } : null;
    if (!user?.userId) return;

    const url = `${window.location.origin}/staff/${user.userId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="big-button blue" onClick={handleClick} style={{ gap: "8px" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      {copied ? "Copied!" : "Share Booking Page Link"}
    </button>
  );
}
