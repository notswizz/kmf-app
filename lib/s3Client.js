import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to upload a file to S3
export async function uploadToS3(file, bucketName, key) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file
  });

  try {
    const response = await s3Client.send(command);
    return response; // or handle response as needed
  } catch (error) {
    console.error("Error uploading to S3", error);
    throw error;
  }
}
