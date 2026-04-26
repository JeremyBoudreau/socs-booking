import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

// adds a user field to the `Request` object, which will hold the authenticated user's info (id, email, role)
export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string };
}

// verifies the JWT token attached to the request, and rejects if missing or invalid
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    // get token from the "Authorization" header, which should be in the format "Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    // verify the token and extract the payload (user info) from it
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }
        req.user = decoded as { id: string; email: string; role: string };
        next();
    });
};

// only allows owners (@mcgill.ca) to proceed
export const requireOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== "owner") {
        res.status(403).json({ error: "Only owners can perform this action" });
        return;
    }
    next();
};
