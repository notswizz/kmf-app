// pages/api/login.js
import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    const user = await db.collection('users').findOne({ username });
    if (!user) {
      client.close();
      return res.status(401).json({ message: 'User not found!' });
    }

    // Directly compare the plain text passwords
    if (password !== user.password) {
      client.close();
      return res.status(403).json({ message: 'Invalid password!' });
    }

    // Implement token-based session or similar strategy here

    client.close();
    res.status(200).json({ message: 'Logged in!' });
  }
}

export default handler;
