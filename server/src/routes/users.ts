import { Router, type Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db.js";
import { authenticateToken, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/users/:id — fetch basic public profile (name) for a given user
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(req.params["id"] as string) });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    res.json({ name: `${user["firstName"]} ${user["lastName"]}`, email: user["email"] });
});

export default router;
