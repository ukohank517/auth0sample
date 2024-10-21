import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

const customAuthCheck = (Component: React.ComponentType) => {
  return withPageAuthRequired(function ProtectedPage(props) {
    const { user, error, isLoading } = useUser();
    const [ onWorking, setOnWorking ] = useState(true);

    // MEMO: '/autherr' をログアウト後のリダイレクト先を設定する必要もある
    useEffect(() => {
      if (!isLoading && user) {
        // メアドでログインした場合、メール認証が完了していない場合はログアウト
        if (user.sub?.substring(0, 5) === 'auth0' && user.email_verified === false) {
          window.location.href = '/api/auth/logout?returnTo=/autherr?error=mail_verification';
        } else if(user.email === undefined){
          // メアドが存在しない場合はログアウト
          window.location.href = '/api/auth/logout?returnTo=/autherr?error=no_mail';
        } else {
          // エラーなし
          setOnWorking(false);
        }
      }
    }, [user, isLoading]);

    return (<>
      {(isLoading) && (<div>Loading...</div>)}
      {(onWorking) && (<div>Working...</div>)}
      {(error) && (<div>Error: {error.message}</div>)}
      {(!isLoading && !onWorking && !error) && (<Component {...props} />)}
      </>
    )

    // // ローディング中やエラー発生時の処理
    // if (isLoading || onWorking) return (<div>Loading...</div>);
    // if (error) return <div>Error: {error.message}</div>;

    // // 条件を満たさないユーザーは通常通りコンポーネントをレンダリング
    // return <h1>nothing</h1>
    // //<Component {...props} />;
  });
};

export default customAuthCheck;
