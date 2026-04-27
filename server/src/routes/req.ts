import { Router, type Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db.js";
import { authenticateToken, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// CREATE request
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    // user student fetch
    const dbUser = await db.collection("users").findOne({
      _id: new ObjectId(user.id),
    });

    if (!dbUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // prof fetch
    const owner = await db.collection("users").findOne({
      _id: new ObjectId(req.body.ownerId),
    });

    if (!owner) {
      res.status(404).json({ error: "Owner not found" });
      return;
    }

    const request = {
      ownerId: req.body.ownerId,
      ownerName: `${owner["firstName"]} ${owner["lastName"]}`,
      ownerEmail: owner["email"],

      course: req.body.course,
      start: new Date(req.body.start).toISOString(),
      end: new Date(req.body.end).toISOString(),

      type: "request",
      status: "pending",

      createdBy: {
        userId: user.id,
        name: `${dbUser["firstName"]} ${dbUser["lastName"]}`,
        email: user.email,
      },

      message: req.body.message,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("requests").insertOne(request);

    res.json({
      _id: result.insertedId,
      ...request,
    });
  }
);

// GET student's own sent requests
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    const requests = await db
      .collection("requests")
      .find({ "createdBy.userId": user.id })
      .toArray();
    res.json(requests);
  }
);

// GET owner requests
router.get(
  "/owner",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }

    const requests = await db
      .collection("requests")
      .find({ ownerId: user.id })
      .toArray();

    res.json(requests);
  }
);

// ACCEPT request
router.post(
  "/:id/accept",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const id = req.params["id"] as string; 
    const request = await db.collection("requests").findOne({
      _id: new ObjectId(id),
    });

    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    if (request["status"] !== "pending") {
        res.status(400).json({ error: "Request already handled" });
        return;
    }

    await db.collection("requests").updateOne(
      { _id: request["_id"] },
      { $set: { status: "confirmed" } }
    );

    res.json({ ok: true });
  }
);

router.post(
  "/:id/deny",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const id = req.params["id"] as string; 
    await db.collection("requests").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "denied" } }
    );

    res.json({ ok: true });
  }
);

// DELETE (cancel) a request — only the student who created it can cancel
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    const request = await db.collection("requests").findOne({
      _id: new ObjectId(req.params["id"] as string),
    });
    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    if (request["createdBy"].userId !== user.id) {
      res.status(403).json({ error: "Not your request" });
      return;
    }
    await db.collection("requests").deleteOne({ _id: request["_id"] });
    res.json({ ok: true, ownerEmail: request["ownerEmail"], course: request["course"], date: request["date"], time: request["time"] });
  }
);

export default router;