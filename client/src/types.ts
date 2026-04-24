
export type Slot = {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  course: string;
  start: string; //"2026-04-24T14:00:00"
  end: string; //"2026-04-24T16:00:00"
  groupID: string; //If using the poll method, all "grouped" slots use the same ID. Otherwise, GroupID is "single"
  type: "poll" | "standard";
  status: "private" | "active" | "booked";

  bookedBy: { userId: string; name: string; email: string }[]; //Many students can book one slot
  createdAt: string;
};

type Poll = {
  _id: string;
  ownerId: string;
  course: string;
  status: "open" | "finalized";
  createdAt: string;
};


type PollSlot = {
  _id: string;
  pollId: string; // foreign key reference to Poll:_id
  start: string;
  end: string;
};

type PollVote = {
  _id: string;
  pollSlotId: string; // foreign key reference to PollSlot:_id
  userId: string; // foreign key reference to User:_id
};

export type RequestSlot = {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  course: string;
  start: string; //"2026-04-24T14:00:00"
  end: string; //"2026-04-24T16:00:00"
  status: "pending" | "denied" | "confirmed";
  createdBy: { userId: string; name: string; email: string };
  createdAt: string;
  message: string;
}