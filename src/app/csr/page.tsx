'use client';

import React from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import customAuthCheck from '@/middleware/custom_auth/customAuthCheck';

export default customAuthCheck(function CSRPage() {
  const {user} = useUser();
  console.log('クライアント側でのレンダリングページからのログインユーザー情報：');
  console.log(user);
  return (
    <>
      <div className="mb-5" data-testid="csr">
        <h1 data-testid="csr-title">Client-side Rendered Page</h1>
        <div data-testid="csr-text">
          <p>
            <code>withPageAuthRequired</code>でラップすることで、サーバ側でのレンダリングページを保護できます。ログインしているユーザーのみアクセスできます。ログアウトしている場合は、ログインページにリダイレクトされます。
          </p>
          <p>
            <code>useUser</code> フックを使用して、保護されたクライアント側でレンダリングされたページからユーザープロフィールにアクセスします。 <code>useUser</code> フックは <code>UserProvider</code> コンテキストプロバイダーに依存しているため、カスタム <a href="https://nextjs.org/docs/advanced-features/custom-app">App Component</a> でそれをラップする必要があります。
          </p>
          <p>
            ユーザープロフィールは、<code>/api/auth/me</code> API ルートを呼び出すことで取得できます。（ライブラリより提供されてる標準機能）
          </p>
        </div>
      </div>
    </>
  );
});
