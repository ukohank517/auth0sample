import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth();

/**
 * この書き方で、以下のルートが作成される
 * /api/auth/login: auth0のログインページにリダイレクトする
 * /api/auth/logout: auth0のログアウトページにリダイレクトする
 * /api/auth/callback: auth0で認証が完了した後にここにリダイレクトされる
 * /api/auth/me: auth0ログイン後、ユーザー情報を取得する
 */