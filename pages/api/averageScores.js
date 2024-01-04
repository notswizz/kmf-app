import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const personId = req.query.personId; // Get the personId from the query parameters
      const db = await connectToDatabase();
      const collection = db.collection('images');

      // Calculate the average score for the selected person
      const pipeline = [
        {
          $match: {
            personId: personId, // Match images for the selected person
          },
        },
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$score' }, // Calculate the average score
          },
        },
      ];

      const result = await collection.aggregate(pipeline).toArray();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
