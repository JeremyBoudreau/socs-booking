import 'dotenv/config';
import { MongoClient } from 'mongodb';

const mongoUrl = process.env['MONGO_URL'];
if (!mongoUrl) throw new Error('MONGO_URL is not set');

const client = new MongoClient(mongoUrl);
await client.connect();

const db = client.db('booking');


export default db;