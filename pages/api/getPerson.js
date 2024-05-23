import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,  // Increase server selection timeout
    });
    return client.db();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Database connection failed');
  }
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
