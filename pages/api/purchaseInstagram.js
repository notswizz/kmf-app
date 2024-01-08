// pages/api/purchaseInstagram.js

import { MongoClient } from 'mongodb';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const { userId, pointsToDeduct, imageId } = req.body;

  try {
    // Fetch the user from the database
    const user = await db.collection('users').findOne({ "_id": userId });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.points < pointsToDeduct) {
      throw new Error('Insufficient points');
    }

    // Deduct points and update the user's points in the database
    const updatedPoints = user.points - pointsToDeduct;
    await db.collection('users').updateOne({ "_id": userId }, { $set: { points: updatedPoints } });

    // Fetch the Instagram handle of the selected image/person
    const selectedPerson = await db.collection('people').findOne({ "_id": imageId });
    const instagramHandle = selectedPerson ? selectedPerson.instagram : null;

    res.status(200).json({ message: 'Purchase successful', newPoints: updatedPoints, instagramHandle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

export default handler;
