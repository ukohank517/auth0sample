import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const domain = process.env.AUTH0_ISSUER_BASE_URL;

    const data: Record<string, string> = {
      prompt: 'login', // 既存の認証情報を無視して再度認証処理を行う
      response_type: 'code',
      client_id: process.env.AUTH0_CLIENT_ID as string,
      redirect_uri: process.env.AUTH0_CALLBACK_URL as string,
      audience: process.env.AUTH0_AUDIENCE as string,
      code_challenge: process.env.AUTH0_CODE_CHALLENGE as string,
      code_challenge_method: 'S256',
      scope: 'openid profile email appointments contacts update',
      state: 'xyzABC123', // 適当
    }

    const url = `${domain}/authorize?${new URLSearchParams(data).toString()}`;

    res.status(200).json({ url: url });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}