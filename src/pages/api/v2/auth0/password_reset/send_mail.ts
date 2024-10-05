import { submitPostRequest } from '@/lib/Auth0Client';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const { email } = req.body;
    console.log('server side password_reset', email);

    const path = `/dbconnections/change_password`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    }
    const body: Record<string, string> = {
      client_id: process.env.AUTH0_CLIENT_ID || '',
      email: email,
      connection: 'Username-Password-Authentication',
    }
    const response = await submitPostRequest(path, headers, body) // const t = await response.text();
    console.log('password_reset response is only a text, not json!!!!!!!!!!!!!!!!!!!!', response);
    res.status(200).json({'message': response});
  }else{
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}