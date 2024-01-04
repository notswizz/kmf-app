import { MongoClient, ObjectId } from 'mongodb';

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('images');

      // Get the imageId from the query parameters
      const imageId = req.query.imageId;

      // Check if the image exists
      const existingImage = await collection.findOne({ _id: new ObjectId(imageId) });

      if (!existingImage) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }

      // Delete the image
      await collection.deleteOne({ _id: new ObjectId(imageId) });

      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end('Method Not Allowed');
  }
}
