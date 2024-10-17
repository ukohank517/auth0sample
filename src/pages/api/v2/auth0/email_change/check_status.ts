import { submitDeleteRequest, submitGetRequest, submitPatchRequest, submitPostRequest } from '@/lib/Auth0Client';
import { changeMail, deleteMail, getIdTokenByOtpCode } from '@/lib/Auth0Management';
import { getUserIdFromIdToken } from '@/lib/jwtHelper';
import { getSession } from '@auth0/nextjs-auth0';
import { time } from 'console';
import { get, request } from 'http';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const nowusersession = await getSession(req, res) as JwtPayload;
    const nowuserid = nowusersession.user.sub.toString();

    const {oldMail, newMail, oldOtp, newOtp} = req.body;

    // const oldIdToken: string = await getIdToken(oldMail, oldOtp);
    const newIdToken: string = await getIdTokenByOtpCode(newMail, newOtp);

    if(!newIdToken){
      res.status(200).json({
        message: 'failed get token!, means otp is invalid' ,
      });
    }

    // const oldUserId = await getUserIdFromIdToken(oldIdToken);
    const newUserId = await getUserIdFromIdToken(newIdToken) || '';

    // delete new mail;
    await deleteMail(newUserId);

    // change mail;
    await changeMail(nowuserid, newMail);

    res.status(200).json({
      message: 'success get token!' ,
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}






