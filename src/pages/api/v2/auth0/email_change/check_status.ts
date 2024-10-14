import { submitPostRequest } from '@/lib/Auth0Client';
import { getSession } from '@auth0/nextjs-auth0';
import { request } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {mail, otpCode} = req.body;

    const path = `/oauth/token`
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    }
    const body = {
      grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      username: mail,
      realm: 'email',
      otp: otpCode,
    }

    const response = await submitPostRequest(path, headers, body);

    if(response.error) {
      res.status(400).json({
        message: response.error_description,
        response: response
      });
    }

    res.status(200).json({
      message: 'success get token!' ,
      response: response
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// MFA登録
// https://auth0.com/docs/api/authentication?http#add-an-authenticator
// https://auth0.com/docs/api/authentication?http#verify-with-one-time-password-otp-
// https://auth0.com/docs/api/authentication?http#verify-with-out-of-band-oob-


//

// curl --request POST \
//   --url 'https://jinja-dev.us.auth0.com/mfa/challeng' \
//   --header 'content-type: application/json' \
//   -- data '{""}'



// curl --request POST \
//   --url 'https://jinja-dev.us.auth0.com/mfa/associate' \
//   --header 'authorization: Bearer ACCESS_TOKEN or MFA_TOKEN' \
//   --header 'content-type: application/json' \
//   --data '{"client_id": "27dKrDgzhSGiYCLXr8F2g6TIEUqTDugO", "client_secret": "YOUR_CLIENT_SECRET", "authenticator_types":["oob"], "oob_channels":"sms", "phone_number": "+1 555 123456"}'