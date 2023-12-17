import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('images'); 

      const selections = req.body;

      // Perform updates and log results
      for (const [category, id] of Object.entries(selections)) {
        if (id) {
          const updateResult = await collection.updateOne(
            { "_id": new ObjectId(id) }, // Correct usage of ObjectId
            { $inc: { [category]: 1 } }
          );
          console.log(`Update result for ${category}:`, updateResult);
        }
      }

      res.status(200).json({ message: 'Counts updated successfully' });
    } catch (error) {
      console.error('Failed to update counts:', error);
      res.status(500).json({ error: 'Failed to update counts' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
