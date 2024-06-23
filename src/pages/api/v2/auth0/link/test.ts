import { NextApiRequest, NextApiResponse } from 'next';

// sample verifer and challenge
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const crypto = require('crypto');

    const base64URLEncode = (str:any) => {
      return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    }
    const sha256 = (buffer:any) => {
      return crypto.createHash('sha256').update(buffer).digest();
    }

    const verifier = base64URLEncode(crypto.randomBytes(32));
    const challenge = base64URLEncode(sha256(verifier));


    res.status(200).json({ verifier, challenge });
  }else{
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}