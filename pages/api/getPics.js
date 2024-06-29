import { MongoClient } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const imagesCollection = db.collection('images');

      // Fetch one image from the database
      const image = await imagesCollection.findOne({});

      // Respond with the image URL
      if (image) {
        res.status(200).json({ url: image.url });
      } else {
        res.status(404).json({ message: 'No images found' });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    // If not a GET request, return method not allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
