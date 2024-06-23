import { submitGetRequest, submitPostRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET'){
    const code = req.query.code;

    // アクセストークン取得
    const headers: Record<string, string> =  {'content-type': 'application/x-www-form-urlencoded'};
    const data: Record<string, string> = {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      redirect_uri: 'http://localhost:3000/api/auth/callback',
      code_verifier: 'TJh6gqs99c6FCQ3NdfDYE7Umk1BysyH1mm-RrcTKJ5A', // hello.ts で生成した値、テストのため固定, profile/page.tsx とセット
      code: code as string,
    }
    const token_response = await submitPostRequest('/oauth/token', headers, data)
    const new_access_token = token_response.access_token
    if(!new_access_token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // 本人情報取得
    const headers2: Record<string, string> =  {'Authorization': `Bearer ${new_access_token}`};
    const user_response = await submitGetRequest('/userinfo', headers2)

    res.status(200).json({ user_response });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}