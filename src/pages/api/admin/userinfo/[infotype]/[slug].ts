import { submitGetRequest } from '@/lib/Auth0Client';
import { ManagementClient } from 'auth0';
import { NextApiRequest, NextApiResponse } from 'next';

// ref: https://auth0.com/docs/manage-users/user-search/retrieve-users-with-get-users-endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const infotype = req.query.infotype;
    const slug = req.query.slug;

    if(infotype !== 'wallet_address' && infotype !== 'discord_id'){
      res.status(400).json({ message: 'Invalid infotype' });
      return;
    }

    // const path = `/api/v2/users?q=user_metadata.${infotype}:${slug}`;

    // const headers: Record<string, string> = {
    //   // TODO: AUTH0_MANAGEMENT_API_TOKENを取得する
    //   'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    // }
    // const response = await submitGetRequest(path, headers)

    // res.status(200).json(response || {});

    // TODO: empty check
    const auth0 = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    })

    const a = await auth0.users.getAll({ q: `user_metadata.${infotype}:${slug}` })

    res.status(200).json(a.data || {});
  }else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}