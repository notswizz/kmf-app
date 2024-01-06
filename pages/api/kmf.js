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

            // Calculate the total number of ratings
            const totalRatings = (updatedDoc.marry || 0) + (updatedDoc.fuck || 0) + (updatedDoc.kill || 0);

            let newScore = 0;
            if (totalRatings > 0) {
              // Recalculate score divided by total ratings
              newScore = ((updatedDoc.marry || 0) * 3 + (updatedDoc.fuck || 0) * 1 - (updatedDoc.kill || 0) * 5) / totalRatings;
            }

            // Update the score in the document
            await collection.updateOne(
              { "_id": new ObjectId(id) },
              { $set: { score: newScore } }
            );

            // Log the new score of each picture
            console.log(`New score for picture with id ${id}:`, newScore);

          } catch (updateError) {
            console.error(`Error updating ${category} for id ${id}:`, updateError);
          }
        }
      }

      res.status(200).json({ message: 'Ratings updated successfully' });
    } catch (error) {
      console.error('Error handling the request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
