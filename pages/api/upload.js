// pages/api/upload.js

import { MongoClient } from 'mongodb';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configure multer for file handling
const upload = multer();

// MongoDB connection
async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db();
}

// AWS S3 client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload a file to S3
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
  if (req.method === 'POST') {
    upload.single('image')(req, {}, async (error) => {
      if (error) {
        console.error('Multer error:', error);
        return res.status(500).json({ error: error.message });
      }

      try {
        const db = await connectToDatabase();
        const collection = db.collection('images');
        const file = req.file;

        console.log('Received file:', file);

        // Define a unique file name for the S3 bucket
        const fileName = `uploads/${Date.now()}-${file.originalname}`;

        // Upload file to S3
        const fileUrl = await uploadToS3(file, process.env.AWS_BUCKET_NAME, fileName);
        console.log('File URL:', fileUrl);

        // Save metadata in MongoDB
        const metadata = {
          filename: fileName,
          url: fileUrl,
          uploadDate: new Date(),
        };

        const result = await collection.insertOne(metadata);
        console.log('MongoDB insert result:', result);

        res.status(200).json({ message: 'Image uploaded successfully', data: result });
      } catch (dbError) {
        console.error('MongoDB error:', dbError);
        res.status(500).json({ error: dbError.message });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
