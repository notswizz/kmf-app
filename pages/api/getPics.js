import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {  // Change this to GET to simply fetch data
    try {
      const db = await connectToDatabase();
      const imagesCollection = db.collection('images');

      // Fetch three images from the database
      const images = await imagesCollection.find({}).limit(3).toArray();

      // Respond with the images
      res.status(200).json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // If not a GET request, return method not allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
