import { submitGetRequest } from '@/lib/Auth0Client';
import { getManagementApiToken } from '@/lib/Auth0Management';
import { ManagementClient } from 'auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// localhost:3000/api/admin/userlist
// ref: https://auth0.com/docs/api/management/v2/users/get-users
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getManagementApiToken()
  if(req.method === 'GET') {

    const path = `/api/v2/users`
    const headers: Record<string, string> = {
      // TODO: AUTH0_MANAGEMENT_API_TOKENを取得する
      'Authorization': `Bearer ${token}`,
    }

    const response = await submitGetRequest(path, headers)

    res.status(200).json(response || {});

    // const auth0 = new ManagementClient({
    //   domain: process.env.AUTH0_DOMAIN || '',
    //   clientId: process.env.AUTH0_CLIENT_ID || '',
    //   clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    // })

    // // TODO: check page
    // const a = await auth0.users.getAll()

    // res.status(200).json(a.data || {});
  }else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}