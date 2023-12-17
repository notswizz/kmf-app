import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('people'); // Make sure this is the correct collection

      // Extract person IDs from request body and convert to ObjectId
      const personIds = req.body.ids.map(id => new ObjectId(id));

      // Find people by their IDs
      const people = await collection.find({
        '_id': { $in: personIds }
      }).toArray();

      // Map IDs to names
      const namesMap = people.reduce((acc, person) => {
        acc[person._id.toString()] = person.name; // Replace 'name' with the actual field name for the person's name
        return acc;
      }, {});

      res.status(200).json(namesMap);
    } catch (error) {
      console.error('Failed to fetch names:', error);
      res.status(500).json({ error: 'Failed to fetch names' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
