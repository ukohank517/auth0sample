import { submitPostRequest } from '@/lib/Auth0Client';
import { sendResetPasswordMail } from '@/lib/Auth0Management';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'POST') {
    const { email } = req.body;
    console.log('server side password_reset', email);

    res.status(200).json({'message': sendResetPasswordMail(email)});
  }else{
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}