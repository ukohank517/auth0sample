import { submitPostRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';
// setting:
// Authentication > Passwordless > Email (turn on)
// Applications > Applications > [your app] > Settings > (scroll down) > Advanced Settings > Grant Types > Passwordless OTP
// spamに入りがち
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if( req.method === 'POST' ) {
    const { oldMail, newMail } = req.body;
    console.log(oldMail, newMail);

    // 1. TODO: newMailが存在すればエラー返す, ここ省略
    // 2. newMail, oldMailにそれぞれOTPを送信する処理を実装する
    const path = `/passwordless/start`
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'Accept': 'application/json',
    }
    const body = {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      connection: 'email',
      email: newMail,
      send: 'code',
      authParams: {
        scope: 'openid',
        state: 'test_state',
      }
    }

    const response = await submitPostRequest(path, headers, body);

    res.status(200).json({ message: 'ok. OTP認証の有効期限がデフォルトの3分間なので切れたら再度送信しよう.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


