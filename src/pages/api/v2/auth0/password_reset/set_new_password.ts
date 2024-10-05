import { submitGetRequest, submitPatchRequest, submitPostRequest } from '@/lib/Auth0Client';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { connect } from 'http2';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST') {
    const { userId, newPassword } = req.body;

    console.log(userId, newPassword);

    // パスワードリセット
    const path = `/api/v2/users/${userId}`;
    const headers: Record<string, string> = {
      'authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
      'content-type': 'application/json',
    }
    const body: Record<string, string> = {
      password: newPassword,
      connection: 'Username-Password-Authentication',
    }

    const response = await submitPatchRequest(path, headers, body);
    console.log('reset response', response);

    res.status(200).json(response);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}