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

    // 1. create poll
    const poll = await db.collection("polls").insertOne({
        course,
        ownerId: userId,
        status: "open",
    });

    // 2. create poll slots
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
    // 1. get all open polls
    const polls = await db
      .collection("polls")
      .find({ status: "open" })
      .toArray();

    // 2. for each poll, get its slots + votes
    const result = await Promise.all(
      polls.map(async (poll) => {
        const slots = await db
          .collection("pollSlots")
          .find({ pollId: poll._id })
          .toArray();

        // count votes per slot
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
    const { slotId } = req.body;

    // 1. get selected slot
    const slot = await db.collection("pollSlots").findOne({
      _id: new ObjectId(slotId),
    });

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // 2. get votes
    const votes = await db
      .collection("pollVotes")
      .find({ pollSlotId: slot._id })
      .toArray();

    // 3. create real slot
    const newSlot = await db.collection("slots").insertOne({
      ownerId: "TEMP", // replace with actual user if needed
      course: "", // you can fetch from poll if needed
      start: slot.start,
      end: slot.end,
      status: "booked",
      bookedBy: votes.map((v) => ({
        userId: v.userId,
      })),
      createdAt: new Date(),
    });

    // 4. delete poll data
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