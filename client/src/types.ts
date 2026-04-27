interface BaseSlot {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  course: string;
  start: string;
  end: string;
  type: string;
  createdAt: string;
}

export type Slot = BaseSlot & {
  status: "private" | "active" | "booked";
  bookedBy: { userId: string; name: string; email: string } | null;
};

export type RequestSlot = BaseSlot & {
  status: "pending" | "denied" | "confirmed";
  bookedBy: { userId: string; name: string; email: string };
  message: string;
};
