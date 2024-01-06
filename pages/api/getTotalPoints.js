// pages/api/getTotalPoints.js

import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('users');

      // Use the aggregation framework to sum all points
      const totalPoints = await collection.aggregate([
        {
          $group: {
            _id: null,
            totalPoints: { $sum: "$points" }
          }
        }
      ]).toArray();

      res.status(200).json({ totalPoints: totalPoints.length > 0 ? totalPoints[0].totalPoints : 0 });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch total points' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
