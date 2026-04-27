import { Router } from "express";
import db from "../db.js";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);

router.post("/", async (req, res) => {
  try {
    const { course, slots } = req.body;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = user.id;

    const poll = await db.collection("polls").insertOne({
      course,
      ownerId: userId,
      status: "open",
    });

    const pollId = poll.insertedId.toString();

    const pollSlots = slots.map((s: any) => ({
      pollId,
      start: s.start,
      end: s.end,
    }));

    await db.collection("pollSlots").insertMany(pollSlots);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { ownerId } = req.query;

    const query: any = { status: "open" };

    if (ownerId) {
      query.ownerId = ownerId.toString();
    }

    const polls = await db.collection("polls").find(query).toArray();

    const result = await Promise.all(
      polls.map(async (poll) => {
        const pollId = poll._id.toString();

        const slots = await db
          .collection("pollSlots")
          .find({ pollId })
          .toArray();

        const formattedSlots = await Promise.all(
          slots.map(async (slot) => {
            const slotId = slot._id.toString();

            const voteCount = await db
              .collection("pollVotes")
              .countDocuments({ pollSlotId: slotId });

            return {
              id: slotId,
              start: slot.start,
              end: slot.end,
              voteCount,
            };
          })
        );

        return {
          _id: pollId,
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
 
    const poll = await db.collection("polls").findOne({
      _id: new ObjectId(pollId),
    });
 
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
 
    const owner = await db.collection("users").findOne({
      _id: new ObjectId(poll.ownerId),
    });
 
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
 
    const votes = await db
      .collection("pollVotes")
      .find({ pollSlotId: slot._id.toString() })
      .toArray();
 
    if (votes.length === 0) {
      return res.status(400).json({ error: "No votes for this slot" });
    }
 
    const userIds = votes.map((v) => v.userId).filter(Boolean);
 
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds.map((id: string) => new ObjectId(id)) } })
      .toArray();
 
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
 
    const inserts: any[] = [];
    const repeatCount = recurring ? weeks : 1;
 
    const baseStart = new Date(slot.start);
    const baseEnd = new Date(slot.end);
 
    for (let i = 0; i < repeatCount; i++) {
      const newStart = new Date(baseStart);
      const newEnd = new Date(baseEnd);
 
      newStart.setDate(newStart.getDate() + i * 7);
      newEnd.setDate(newEnd.getDate() + i * 7);
 
      for (const vote of votes) {
        const user = userMap.get(vote.userId);
        if (!user) continue;
 
        inserts.push({
          ownerId: poll.ownerId,
          ownerName: `${owner.firstName} ${owner.lastName}`,
          ownerEmail: owner.email,
 
          course: poll.course,
          type: "Group Meeting",
 
          start: newStart.toISOString(),
          end: newEnd.toISOString(),
 
          status: "booked",
 
          bookedBy: {
            userId: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
 
          createdAt: new Date(),
        });
      }
    }
 
    if (inserts.length > 0) {
      await db.collection("slots").insertMany(inserts);
    }
 
    await db.collection("polls").deleteOne({ _id: new ObjectId(pollId) });
    await db.collection("pollSlots").deleteMany({ pollId });
    await db.collection("pollVotes").deleteMany({ pollId });
 
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

    const userId = user.id;

    if (!Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ error: "No slots selected" });
    }

    const votesCollection = db.collection("pollVotes");

    const pollAlreadyVoted = await votesCollection.findOne({
      pollId,
      userId,
    });

    if (pollAlreadyVoted) {
      return res.status(400).json({ error: "You already voted on this poll" });
    }

    const newVotes = slotIds.map((slotId: string) => ({
      pollSlotId: slotId,
      userId,
      pollId,
      createdAt: new Date(),
    }));

    await votesCollection.insertMany(newVotes);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit votes" });
  }
});

export default router;