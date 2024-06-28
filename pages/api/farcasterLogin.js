import { MongoClient } from 'mongodb';
import Cookies from 'cookies';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;
    console.log(`Received username: ${username}`); // Debugging log

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    let user = await db.collection('users').findOne({ username });
    if (!user) {
      // Create a new user if not found
      const result = await db.collection('users').insertOne({
        username,
        points: 0,
        selections: []
      });
      user = await db.collection('users').findOne({ _id: result.insertedId });
    }

    console.log(`User ID: ${user._id}`); // Debugging log

    client.close();

    // Set the user ID in cookies
    const cookies = new Cookies(req, res);
    cookies.set('user', JSON.stringify({ username, _id: user._id }), {
      httpOnly: true, // Ensures the cookie is sent only via HTTP(S), not client JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only used over HTTPS in production
      sameSite: 'lax', // Helps prevent CSRF attacks
    });

    res.status(200).json({ message: 'User logged in with Farcaster!', user: { username, _id: user._id } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;
