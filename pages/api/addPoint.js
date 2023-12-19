// pages/api/addPoint.js
import { MongoClient, ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.body.userId; // Assuming you pass the user's _id in the request

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $inc: { points: 1 } }
  );

  client.close();
  res.status(200).json({ message: 'Points updated' });
}

export default handler;