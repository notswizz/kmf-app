import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const imagesCollection = db.collection('images');
      const usersCollection = db.collection('users'); // Assuming a 'users' collection exists

      const { selections, userId } = req.body; // Assuming userId is passed in the request body

      let newScores = {}; // Object to store new scores

      for (const [category, imageId] of Object.entries(selections)) {
        if (imageId) {
          try {
            // Update kiss, marry, fade counts for the image
            const updateResult = await imagesCollection.updateOne(
              { "_id": new ObjectId(imageId) },
              { $inc: { [category]: 1 } }
            );

            if (updateResult.modifiedCount > 0) {
              // Fetch the updated document
              const updatedDoc = await imagesCollection.findOne({ "_id": new ObjectId(imageId) });

              // Calculate the total number of ratings
              const totalRatings = (updatedDoc.marry || 0) + (updatedDoc.kiss || 0) + (updatedDoc.fade || 0);

              let newScore = 0;
              if (totalRatings > 0) {
                // Recalculate score divided by total ratings
                newScore = ((updatedDoc.marry || 0) * 3 + (updatedDoc.kiss || 0) * 1 - (updatedDoc.fade || 0) * 5) / totalRatings;
              }

              // Update the score in the document
              await imagesCollection.updateOne(
                { "_id": new ObjectId(imageId) },
                { $set: { score: newScore } }
              );

              // Store the new score in newScores object
              newScores[imageId] = newScore;
            }

            // Update the user profile with their selection
            await usersCollection.updateOne(
              { "_id": new ObjectId(userId) },
              { $push: { selections: { category, imageId } } }
            );

          } catch (updateError) {
            console.error(`Error updating ${category} for id ${imageId}:`, updateError);
          }
        }
      }

      // Respond with the new scores
      res.status(200).json({ message: 'Ratings and user selections updated successfully', newScores });
    } catch (error) {
      console.error('Error handling the request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
