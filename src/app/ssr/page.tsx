import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(
  async function SSRPage() {
    const { user }: any = await getSession();

    console.log('サーバ側でのレンダリングページからのログインユーザー情報：')
    console.log(user);
    return (
      <>
        <div className="mb-5" data-testid="ssr">
          <h1 data-testid="ssr-title">Server-side Rendered Page</h1>
          <div data-testid="ssr-text">
            <p>
              <code>withPageAuthRequired</code>でラップすることで、サーバ側でのレンダリングページを保護できます。ログインしているユーザーのみアクセスできます。ログアウトしている場合は、ログインページにリダイレクトされます。
            </p>
            <hr />
            <hr />
            <p>このページは、サーバ側で、下記データがセッションより読み取れた：</p>
            <code>
              {JSON.stringify(user)}
            </code>
          </div>
        </div>
      </>
    );
  },
  { returnTo: '/ssr' }
);
