import { submitGetRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const user_id = req.body.user_id;

    const path = `/api/v2/users/${user_id}`
    const headers: Record<string, string> = {
      // TODO: AUTH0_MANAGEMENT_API_TOKENを取得する
      'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    }
    const response = await submitGetRequest(path, headers)
    const user_metadata = response.user_metadata
    console.log(user_metadata)

    if (!user_metadata) {
      res.status(200).json({ wallet_address: "NOT_CONNECTED" });
      return;
    }

    res.status(200).json({ wallet_address: user_metadata.wallet_address });
  }else{
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}