import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'url';

export default async function page(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // プライマリアカウント
    const { accessToken } = await getAccessToken(req, res);
    // const { user }: any = await getSession();

    // セカンダリアカウント
    const { query } = parse(req.url || '', true);
    const { code } = query;
    const secondaryAccountResponse = await fetch('http://localhost:3000/api/v2/auth0/link/authorization_code?code=' + code);
    if (!secondaryAccountResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const {user_response} = await secondaryAccountResponse.json();
    console.log('accessToken', accessToken)
    console.log('--------------------')
    console.log('user_response', user_response);

    // データ連携
    const data: Record<string, string> = {
      primaryAccessToken: accessToken as string,
      secondaryUserId: user_response.sub,
    }

    const linkAccountResponse = await fetch('http://localhost:3000/api/v2/auth0/link/link_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // TODO: ログインしたことのないユーザーがリンクアカウントとして行うとエラーが発生する
    if(!linkAccountResponse.ok){
      // console.log('linkAccountResponse', linkAccountResponse)
      throw new Error('[front]: linkAccountResponse Network response was not ok');
    }

    const response = await linkAccountResponse.json();
    // console.log('data', response);
    res.redirect('/profile');
    // res.status(200).json({ message: 'helloworldddd' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
