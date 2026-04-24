import { Router, type Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db.js";
import { authenticateToken, requireOwner, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// owner creates a new private slot
// POST /api/slots
router.post("/", authenticateToken, requireOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    // validate request body
    // course of the form "COMP307"
    // date of the form "2024-12-31"
    // time of the form "14:00"
    // type of the form "office hours" or "1-on-1"
    const { course, date, time, type } = req.body;

    // check for missing fields
    if (!course || !date || !time || !type) {
        res.status(400).json({ error: "course, date, time, and type are required" });
        return;
    }

    // insert new slot into database with status "private"
    const users = db.collection("users");
    const owner = await users.findOne({ _id: new ObjectId(req.user!.userId) });
    const ownerName = owner ? `${owner["firstName"]} ${owner["lastName"]}` : req.user!.email;

    const slots = db.collection("slots");
    const result = await slots.insertOne({
        ownerId: new ObjectId(req.user!.userId),
        ownerEmail: req.user!.email,
        ownerName,
        course,
        date,
        time,
        type,
        status: "private",
        bookedBy: null,
        createdAt: new Date(),
    });

    res.status(201).json({ slotId: result.insertedId }); // `result.insertedId` is the ID of the newly inserted slot document
});

// owner makes a slot public so students can see and book it
// PATCH /api/slots/:id/publish
router.patch("/:id/publish", authenticateToken, requireOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const slot = await slots.findOne({ _id: new ObjectId(req.params["id"] as string) });

    // validate that the slot exists and belongs to the owner
    if (!slot) {
        res.status(404).json({ error: "Slot not found" });
        return;
    }

    // the slot's `ownerId` should match the `userId` from the JWT token
    if (slot.ownerId.toString() !== req.user!.userId) {
        res.status(403).json({ error: "You do not own this slot" });
        return;
    }

    // update slot status to "active"
    await slots.updateOne({ _id: new ObjectId(req.params["id"] as string) }, { $set: { status: "active" } });
    res.json({ message: "Slot published" });
});

// owner deletes a slot
// DELETE /api/slots/:id
router.delete("/:id", authenticateToken, requireOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const slot = await slots.findOne({ _id: new ObjectId(req.params["id"] as string) });

    // validate that the slot exists
    if (!slot) {
        res.status(404).json({ error: "Slot not found" });
        return;
    }

    // the slot's `ownerId` should match the `userId` from the JWT token
    if (slot.ownerId.toString() !== req.user!.userId) {
        res.status(403).json({ error: "You do not own this slot" });
        return;
    }

    // delete the slot from the database
    await slots.deleteOne({ _id: new ObjectId(req.params["id"] as string) });

    // return `bookedBy` so the frontend can send a mailto: notification to the user notifying them that their slot was deleted (if the slot was booked by someone)
    // `bookedBy` is an object that contains the `userId`, `name`, and `email` of the user who booked the slot (if any)
    // this `bookedBy` field is set when a user books a slot (POST /api/slots/:id/book route handler)
    res.json({ message: "Slot deleted", bookedBy: slot.bookedBy });
});

// list all active slots for students to browse and book
// GET /api/slots
router.get("/", authenticateToken, async (_req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const users = db.collection("users");
    const activeSlots = await slots.find({ status: "active" }).toArray();

    const enriched = await Promise.all(activeSlots.map(async (slot) => {
        if (!slot["ownerName"]) {
            const owner = await users.findOne({ _id: slot["ownerId"] });
            if (owner) slot["ownerName"] = `${owner["firstName"]} ${owner["lastName"]}`;
        }
        return slot;
    }));

    res.json(enriched);
});

// owner sees all their own slots
// GET /api/slots/created
router.get("/created", authenticateToken, requireOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const mySlots = await slots.find({ ownerId: new ObjectId(req.user!.userId) }).toArray();
    res.json(mySlots);
});

// user books an active slot
// POST /api/slots/:id/book
router.post("/:id/book", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const slot = await slots.findOne({ _id: new ObjectId(req.params['id'] as string) });

    // validate that the slot exists
    if (!slot) {
        res.status(404).json({ error: "Slot not found" });
        return;
    }

    // validate that the slot is active and available for booking
    if (slot.status !== "active") {
        res.status(400).json({ error: "Slot is not available for booking" });
        return;
    }

    // get user's name from the database
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(req.user!.userId) });

    // update the slot's status to "booked" and set the `bookedBy` field to the user's info (userId, name, email)
    await slots.updateOne(
        { _id: new ObjectId(req.params["id"] as string) },
        {
            $set: {
                status: "booked",
                bookedBy: {
                    userId: req.user!.userId,
                    name: `${user!.firstName} ${user!.lastName}`,
                    email: req.user!.email,
                },
            },
        }
    );

    res.json({ message: "Slot booked successfully" });
});

// user cancels their booking
// DELETE /api/slots/:id/book
router.delete("/:id/book", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const slot = await slots.findOne({ _id: new ObjectId(req.params["id"] as string) });

    // validate that the slot exists
    if (!slot) {
        res.status(404).json({ error: "Slot not found" });
        return;
    }

    // validate that the slot is currently booked by the user
    if (slot.bookedBy?.userId !== req.user!.userId) {
        res.status(403).json({ error: "You have not booked this slot" });
        return;
    }

    await slots.updateOne(
        { _id: new ObjectId(req.params["id"] as string) },
        { $set: { status: "active", bookedBy: null } }
    );

    // return owner email so the frontend can send a mailto: notification
    res.json({ message: "Booking cancelled", ownerEmail: slot.ownerEmail });
});

// user sees all their booked slots
// GET /api/slots/booked
router.get("/booked", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const slots = db.collection("slots");
    const bookedSlots = await slots.find({ "bookedBy.userId": req.user!.userId }).toArray();
    res.json(bookedSlots);
});

export default router;
