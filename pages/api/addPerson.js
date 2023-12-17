import { MongoClient } from 'mongodb';

// MongoDB connection
async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('people'); // Adjust the collection name as needed

      // Next.js API routes automatically parse the request body
      // No need to use JSON.parse here
      const person = req.body;

      // Optional: Add server-side validation for the person data here

      const result = await collection.insertOne(person);

      res.status(200).json({ message: 'Person added successfully', data: result });
    } catch (error) {
      console.error('Failed to add person:', error);
      res.status(500).json({ error: 'Failed to add person' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
