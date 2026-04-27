export function displayTime(iso: string | undefined): string {
  if (!iso) return "";
  if (iso.includes("T")) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  // raw "HH:MM" from a form input (used in pill previews before saving)
  return new Date(`1970-01-01T${iso}:00`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isoToMonthDay(iso: string | undefined): { month: string; day: number } {
  if (!iso) return { month: "—", day: 0 };
  const d = new Date(iso);
  return {
    month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
    day: d.getDate(),
  };
}
