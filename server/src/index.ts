import express, { type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import slotsRoutes from './routes/slots.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors()); // allow cross-origin requests from the React dev server
app.use(express.json()); // parse incoming JSON request bodies
app.use(express.static(path.join(__dirname, '../../client/dist'))); // serve the built React app

// authentication routes (register, login)
app.use("/api/auth", authRoutes);

// slot management routes (create, activate, delete, book, cancel)
app.use("/api/slots", slotsRoutes);

// catch-all (serve React's index.html for any non-API route)
app.get('/{*path}', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// start server on port `PORT`
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
