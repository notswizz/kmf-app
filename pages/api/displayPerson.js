// pages/api/averageScores.js

import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const personId = req.query.personId; // Retrieve the personId from query parameters

    try {
      const db = await connectToDatabase();
      const collection = db.collection('images');

      // Fetch images for the selected person
      const images = await collection.find({ personId }).toArray();

      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
