import { submitGetRequest, submitPostRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST'){
    const primaryAccessToken = req.body.primaryAccessToken;
    const secondaryUserId = req.body.secondaryUserId;
    console.log('primaryAccessToken', primaryAccessToken)
    console.log('secondaryUserId', secondaryUserId)
    const [provider, ...userId] = secondaryUserId.split('|')

    // プライマリアカウント情報取得
    const primaryHeader: Record<string, string> = {
      Authorization: `Bearer ${primaryAccessToken}`,
    }
    const primaryUserAccount = await submitGetRequest('/userinfo', primaryHeader)
    const primaryUserId = primaryUserAccount.sub

    // アカウント連携
    const linkHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`, // TODO: AUTH0_MANAGEMENT_API_TOKENを取得する
    }
    const linkData: Record<string, string> = {
      provider: provider,
      user_id: userId.join('|'),
    }
    const path = `/api/v2/users/${primaryUserId}/identities`
    const linkAccountResponse = await submitPostRequest(path, linkHeaders, linkData);

    if(!linkAccountResponse.ok){
      console.log('linkAccountResponse fail', linkAccountResponse)
      res.status(500).json({ message: '[backend]: linkAccountResponse Network response was not ok' });
    }
    console.log('backend success, linkAccountResponse', linkAccountResponse)

    // res.status(200).json({ linkAccountResponse });
    res.status(200).json({ message: 'helloworld' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
