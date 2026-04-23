import "../styles/RowBox.css";

export default function InviteLinkButton() {
  const handleClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const name = user ? `${user.firstName}+${user.lastName}` : "Unknown";

    navigator.clipboard.writeText(name);

    console.log("Copied:", name);
  };
  return (
    <button className="big-button blue" onClick={handleClick}>
      Invite Link
    </button>
  );
}
