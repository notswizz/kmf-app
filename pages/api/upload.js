import { MongoClient } from 'mongodb';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const upload = multer();

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file, bucketName, key) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const response = await s3Client.send(command);
    console.log('S3 upload response:', response);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

export default function handler(req, res) {
  upload.single('image')(req, {}, async (error) => {
    if (error) {
      console.error('Multer error:', error);
      return res.status(500).json({ error: error.message });
    }

    try {
      const db = await connectToDatabase();
      const collection = db.collection('images');
      const file = req.file;

      // Retrieve additional data and score from the request
      const personId = req.body.person;
      const kill = parseInt(req.body.kill);
      const marry = parseInt(req.body.marry);
      const fuck = parseInt(req.body.fuck);
      const score = parseInt(req.body.score);  // Retrieve score

      const fileName = `uploads/${Date.now()}-${file.originalname}`;

      const fileUrl = await uploadToS3(file, process.env.AWS_BUCKET_NAME, fileName);

      // Save metadata including score in MongoDB
      const metadata = {
        filename: fileName,
        url: fileUrl,
        personId,
        uploadDate: new Date(),
        kill,
        marry,
        fuck,
        score  // Include score in the metadata
      };

      const result = await collection.insertOne(metadata);
      res.status(200).json({ message: 'Image uploaded successfully', data: result });
    } catch (dbError) {
      console.error('MongoDB error:', dbError);
      res.status(500).json({ error: dbError.message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
