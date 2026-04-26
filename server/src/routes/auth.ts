import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = Router();
const SALT_ROUNDS = 10;
const LOGIN_INTERVAL = "7d"

// verifies if the entered email is a valid mcgill email
const isValidMcgillEmail = (email: string) => {
    return email.endsWith("@mail.mcgill.ca") || email.endsWith("@mcgill.ca");
}

// assigns a role based on the domain name of the entered email
const roleFromEmail = (email: string) => {
    if (email.endsWith("@mcgill.ca") && !email.endsWith("@mail.mcgill.ca")) {
        return "owner";
    } else {
        return "user";
    }
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    // grab fields from request
    const { firstName, lastName, email, password } = req.body;

    // check if any fields are missing
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    // check if email is valid or not
    if (!isValidMcgillEmail(email)) {
        res.status(400).json({ error: "Only McGill email addresses are allowed" });
        return;
    }

    // check if an account has been created with the entered email address
    const users = db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
    }

    // hash the desired user's password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = roleFromEmail(email);

    // creates a user in the database as a document
    await users.insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
    });

    // send a response indicating the account has been created successfully
    res.status(201).json({ message: "Account created successfully" });
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    // grab fields from request
    const { email, password } = req.body;

    // checks if the user input the email and the password
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }

    // locates the user from the database
    const users = db.collection("users");
    const user = await users.findOne({ email });

    // checks if the user exists
    if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }
    // verifies if the input password is correct
    const passwordMatch = await bcrypt.compare(password, user["password"] as string);
    if (!passwordMatch) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
    }

    // create a JWT token. This token is used so the user doesn't have to log in every single time (only after 7 days)
    // Flow:
    // 1. A user logs in. Then, the server creates and signs a token, and then it sends it to the client.
    // 2. The Client stores it in localStorage
    // 3. For subsequent logins within 7 days, every time the user logs in, the client sends the JWT token to the server,
    //    where the server receives it, verifies the signature with JWT_SECRET, and trusts the payload if it matches
    //    (which means it won't need to query the database to validate the payload again)
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role }, // the payload, used to know who's logged in when reading from the frontend
        secret, // used to sign the token so the server can verify it wasn't tampered with
        { expiresIn: LOGIN_INTERVAL } // forces the user to log in again
    );

    // send a response back with the JWT token,
    res.json({
        token,
        // sending back the user's info so the client
        // can display the first name and last name
        // and know the user's role for authorization purposes
        // without needing to decode the JWT token on the client side
        user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });
});

// Exports the router so `index.ts` can import it and mount it via `app.use('/api/auth', authRoutes)`.
export default router;
