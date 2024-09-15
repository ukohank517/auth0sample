import { submitGetRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';

// localhost:3000/api/admin/userlist
// ref: https://auth0.com/docs/api/management/v2/users/get-users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {

    const path = `/api/v2/users`
    const headers: Record<string, string> = {
      // TODO: AUTH0_MANAGEMENT_API_TOKENを取得する
      'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    }

    const response = await submitGetRequest(path, headers)

    res.status(200).json(response || {});
  }else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}