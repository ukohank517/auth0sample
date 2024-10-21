import { handleAuth, handleLogout } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default handleAuth({
  logout: async (req: NextApiRequest, res: NextApiResponse) => {
    const returnTo = req.query.returnTo as string;
    console.log('logout', returnTo);

    await handleLogout(req, res, {
      returnTo: returnTo,
      logoutParams: {
        federated: true, // SSOセッションも削除する
      }
    });
  }
});

/**
 * この書き方で、以下のルートが作成される
 * /api/auth/login: auth0のログインページにリダイレクトする
 * /api/auth/logout: auth0のログアウトページにリダイレクトする
 * /api/auth/callback: auth0で認証が完了した後にここにリダイレクトされる
 * /api/auth/me: auth0ログイン後、ユーザー情報を取得する
 */