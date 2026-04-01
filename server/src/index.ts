import express, { type Request, type Response } from 'express';
import cors from 'cors';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('/api/health', async (_req: Request, res: Response): Promise<void> => {
    await db.command({ ping: 1 });
    res.json({ status: 'ok', db: 'connected' });
});

app.get('/{*path}', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
