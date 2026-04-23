export type Slot = {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  course: string;
  date: string;
  time: string;
  type: string;
  status: "private" | "active" | "booked";
  bookedBy: { userId: string; name: string; email: string } | null;
  createdAt: string;
};

export type RequestSlot = {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  course: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "denied" | "confirmed";
  createdBy: { userId: string; name: string; email: string };
  createdAt: string;
  message: string;
}