import { submitPostRequest } from '@/lib/Auth0Client';
import { sentOtpToMail } from '@/lib/Auth0Management';
import { NextApiRequest, NextApiResponse } from 'next';
// setting:
// Authentication > Passwordless > Email (turn on)
// Applications > Applications > [your app] > Settings > (scroll down) > Advanced Settings > Grant Types > Passwordless OTP
// spamに入りがち
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if( req.method === 'POST' ) {
    const { oldMail, newMail } = req.body;
    console.log(oldMail, newMail);

    // 1. TODO: newMailが存在すればエラー返す, ここ省略
    // 2. newMail, oldMailにそれぞれOTPを送信する処理を実装する
    await sentOtpToMail(newMail);
    // await sentOtpToMail(oldMail);

    res.status(200).json({ message: 'ok. OTP認証の有効期限がデフォルトの3分間なので切れたら再度送信しよう.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}