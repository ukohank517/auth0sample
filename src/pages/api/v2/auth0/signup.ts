import { submitPostRequest } from '@/lib/Auth0Client';
import { verify } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

// memo:
// ref: https://auth0.com/docs/api/management/v2/users/post-users
// ユーザー登録の画面を無効化した(下記手順)
// manage管理画面 > Authentication > Database > Username-Password-Authentication > Disable Sign Ups
// そのため、ログイン画面ではサインアップのボタンが表示されません。
// ユーザー登録する際に、このAPIを利用してユーザーidとパスワードでアカウントを登録し、認証メールが送信されます。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const { email, password } = req.body;
    console.log('server side signup', email, password);


    const path = `/api/v2/users`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    }
    const body = {
      email: email,
      blocked: false,
      name: email.split('@')[0], // emailの@より前をnameとして登録
      password: password,
      connection: 'Username-Password-Authentication',
      email_verified: false, // メール認証がまだされていない
      verify_email: true, // 認証メールを送信する
    }

    const response = await submitPostRequest(path, headers, body)
    console.log('signup response', response);

    res.status(200).json(response);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}