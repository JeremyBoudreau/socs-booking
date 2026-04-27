import { Router } from "express";
import db from "../db.js";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/auth.js";



const router = Router();
router.use(authenticateToken);



router.post("/", async (req, res) => {
  try {
    const { course, slots } = req.body;
    const user = (req as any).user; //(req as any) removes warning, not technically needed

    if (!user) {
  return res.status(401).json({ error: "Unauthorized" });
}
const userId = user.id;

    const poll = await db.collection("polls").insertOne({
        course,
        ownerId: userId,
        status: "open",
    });

    const pollSlots = slots.map((s: any) => ({
      pollId: poll.insertedId,
      start: s.start,
      end: s.end,
    }));

    await db.collection("pollSlots").insertMany(pollSlots);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create poll" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { ownerId } = req.query;

    const query: any = { status: "open" };

    if (ownerId) {
      query.ownerId = ownerId; 
    }

    const polls = await db
      .collection("polls")
      .find(query)
      .toArray();

    const result = await Promise.all(
      polls.map(async (poll) => {
        const slots = await db
          .collection("pollSlots")
          .find({ pollId: poll._id })
          .toArray();

        const formattedSlots = await Promise.all(
          slots.map(async (slot) => {
            const voteCount = await db
              .collection("pollVotes")
              .countDocuments({ pollSlotId: slot._id });

            return {
              id: slot._id,
              start: slot.start,
              end: slot.end,
              voteCount,
            };
          })
        );

        return {
          _id: poll._id,
          course: poll.course,
          slots: formattedSlots,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

router.post("/:pollId/finalize", async (req, res) => {
  try {
    const { pollId } = req.params;
    const { slotId, recurring, weeks } = req.body;

    const slot = await db.collection("pollSlots").findOne({
      _id: new ObjectId(slotId),
    });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    const votes = await db
      .collection("pollVotes")
      .find({ pollSlotId: slot._id })
      .toArray();

    if (votes.length === 0) {
      return res.status(400).json({ error: "No votes for this slot" });
    }

    const userIds = votes.map((v) => new ObjectId(v.userId));

    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));


    //inserts[] is the slots we'll be adding at the end of this API call
    const inserts = [];
    const repeatCount = recurring ? weeks : 1;

    const baseStart = new Date(slot.start);
const baseEnd = new Date(slot.end);

    for (let i = 0; i < repeatCount; i++) {
  const newStart = new Date(baseStart);
  const newEnd = new Date(baseEnd);

  newStart.setDate(newStart.getDate() + i * 7);
  newEnd.setDate(newEnd.getDate() + i * 7);

  for (const vote of votes) {
    const user = userMap.get(vote.userId.toString());
    if (!user) continue;

    inserts.push({
      ownerId: slot.ownerId,
      ownerName: slot.ownerName,
      ownerEmail: slot.ownerEmail,

      course: slot.course,
      type: slot.type,

      start: newStart.toISOString(),
      end: newEnd.toISOString(),

      status: "booked",

      bookedBy: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
      },

      createdAt: new Date(),
    });
  }
}

    await db.collection("slots").insertMany(inserts);

    await db.collection("polls").deleteOne({
      _id: new ObjectId(pollId),
    });

    await db.collection("pollSlots").deleteMany({
      pollId: new ObjectId(pollId),
    });

    await db.collection("pollVotes").deleteMany({
      pollSlotId: new ObjectId(slotId),
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Finalize failed" });
  }
});

router.post("/:pollId/vote", async (req, res) => {
  try {
    const { pollId } = req.params;
    const { slotIds } = req.body;

    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = user.userId;

    if (!Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ error: "No slots selected" });
    }

    const votesCollection = db.collection("pollVotes");
    
const objectSlotIds = slotIds.map((id: string) => new ObjectId(id));

const pollAlreadyVoted = await votesCollection.findOne({
  pollId: new ObjectId(pollId),
  userId,
});

if (pollAlreadyVoted) {
  return res.status(400).json({ error: "You already voted on this poll" });
}

const existingVotes = await votesCollection
  .find({
    userId,
    pollSlotId: { $in: objectSlotIds },
  })
  .toArray();

    const alreadyVoted = new Set(
      existingVotes.map((v) => v.pollSlotId.toString())
    );

const newVotes = objectSlotIds.map((slotId) => ({
  pollSlotId: slotId,
  userId,
  pollId: new ObjectId(pollId),
  createdAt: new Date(),
}));

    if (newVotes.length === 0) {
      return res.status(200).json({ message: "Already voted" });
    }

    await votesCollection.insertMany(newVotes);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit votes" });
  }
});

export default router;