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

      for (const [category, id] of Object.entries(selections)) {
        if (id) {
          try {
            // Update kill, marry, fuck counts
            const updateResult = await collection.updateOne(
              { "_id": new ObjectId(id) },
              { $inc: { [category]: 1 } }
            );

            // Fetch the updated document
            const updatedDoc = await collection.findOne({ "_id": new ObjectId(id) });

            // Recalculate score
            const newScore = (updatedDoc.marry || 0) * 3 + 
                             (updatedDoc.fuck || 0) * 1 - 
                             (updatedDoc.kill || 0) * 5;

            // Update the score in the document
            await collection.updateOne(
              { "_id": new ObjectId(id) },
              { $set: { score: newScore } }
            );

            console.log(`Update result for ${category}:`, updateResult);
          } catch (updateError) {
            console.error(`Error updating ${category} for id ${id}:`, updateError);
          }
        }
      }

      res.status(200).json({ message: 'Counts and score updated successfully' });
    } catch (error) {
      console.error('Failed to update counts and score:', error);
      res.status(500).json({ error: 'Failed to update counts and score' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
