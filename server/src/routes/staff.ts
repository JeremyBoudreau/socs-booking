import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/overview", async (req, res) => {
  try {
    const staff = await db
      .collection("users")
      .find({ role: "owner" })
      .toArray();

    const slots = await db
      .collection("slots")
      .find({ status: "active" })
      .toArray();

    const polls = await db
      .collection("polls")
      .find({ status: "open" })
      .toArray();

    const slotCountMap = new Map<string, number>();
    const pollCountMap = new Map<string, number>();

    for (const slot of slots) {
      const id = slot.ownerId?.toString();
      if (!id) continue;

      slotCountMap.set(id, (slotCountMap.get(id) || 0) + 1);
    }

    for (const poll of polls) {
      const id = poll.ownerId?.toString();
      if (!id) continue;

      pollCountMap.set(id, (pollCountMap.get(id) || 0) + 1);
    }

    const result = staff.map((s) => {
      const id = s._id.toString();

      const fullName =
        `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "Unknown";

      return {
        ownerId: id,
        ownerName: fullName,
        ownerEmail: s.email,
        slotCount: slotCountMap.get(id) || 0,
        pollCount: pollCountMap.get(id) || 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load staff overview" });
  }
});

export default router;