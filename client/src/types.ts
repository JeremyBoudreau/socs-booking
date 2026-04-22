export type Slot = {
  _id: string;
  ownerId: string;
  ownerEmail: string;
  course: string;
  date: string;
  time: string;
  type: string;
  status: "private" | "active" | "booked";
  bookedBy: { userId: string; name: string; email: string } | null;
  createdAt: string;
};
