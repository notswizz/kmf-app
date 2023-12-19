import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  
  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) {
    client.close();
    return res.status(422).json({ message: 'User already exists' });
  }

  // Create new user with plain text password (not recommended for production)
  const result = await db.collection('users').insertOne({
    username,
    password // Stored in plain text
  });

  client.close();
  res.status(201).json({ message: 'User created' });
}

export default handler;
