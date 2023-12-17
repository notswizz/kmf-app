import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('people'); // Adjust collection name as needed

      const people = await collection.find({}).toArray();

      res.status(200).json(people);
    } catch (error) {
      console.error('Failed to fetch people:', error);
      res.status(500).json({ error: 'Failed to fetch people' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
