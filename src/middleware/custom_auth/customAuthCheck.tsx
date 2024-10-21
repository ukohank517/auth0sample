import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

const customAuthCheck = (Component: React.ComponentType) => {
  return withPageAuthRequired(function ProtectedPage(props) {
    const { user, error, isLoading } = useUser();

    // MEMO: '/autherr' をログアウト後のリダイレクト先を設定する必要もある
    useEffect(() => {
      if (!isLoading && user) {

        // メアドでログインした場合、メール認証が完了していない場合はログアウト
        if (user.sub?.substring(0, 5) === 'auth|' && user.email_verified === false) {
          window.location.href = '/api/auth/logout?returnTo=/autherr?error=mail_verification';
        }

        // メアドが存在しない場合はログアウト
        if(user.email === undefined){
          window.location.href = '/api/auth/logout?returnTo=/autherr?error=no_mail';
        }
      }
    }, [user, isLoading]);

    // ローディング中やエラー発生時の処理
    if (isLoading) return (<div>Loading...</div>);
    if (error) return <div>Error: {error.message}</div>;

    // 条件を満たさないユーザーは通常通りコンポーネントをレンダリング
    return <Component {...props} />;
  });
};

export default customAuthCheck;
