import { submitGetRequest, submitPatchRequest, submitPostRequest } from '@/lib/Auth0Client';
import { setNewPassword } from '@/lib/Auth0Management';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { connect } from 'http2';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST') {
    const { userId, newPassword } = req.body;
    console.log(userId, newPassword);


    res.status(200).json(setNewPassword(userId, newPassword));
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}