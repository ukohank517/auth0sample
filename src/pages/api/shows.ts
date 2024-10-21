import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { accessToken } = await getAccessToken(req, res);

    console.log(accessToken) // このトークンを使って、ログイン中のユーザーの情報を取得できる

    res.status(200).json({ message: 'helloworldddd' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


export default withApiAuthRequired(handler);