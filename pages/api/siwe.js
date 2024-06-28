import { SiweMessage } from 'siwe';
import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  const { message, signature } = req.body;

  try {
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);

    // Perform your authentication logic here
    // For example, create a session or issue a JWT
    // Here, we'll just set a cookie for simplicity

    const cookies = new Cookies(req, res);
    cookies.set('user', JSON.stringify({ username: fields.address }), { httpOnly: true });

    res.status(200).json({ success: true, fields });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}