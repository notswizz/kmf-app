import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection('users');

      const { userId } = req.body;

      if (userId) {
        // Update points for the user
        await usersCollection.updateOne(
          { "_id": new ObjectId(userId) },
          { $inc: { points: 1 } }
        );
      }

      res.status(200).json({ message: 'Points updated successfully' });
    } catch (error) {
      console.error('Error updating points:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}