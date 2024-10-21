'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const errorCode = searchParams?.get('error');

  return (<>
    <div>
      <h1>Error Page</h1>
      {errorCode === 'mail_verification' && (
        <p>メール認証が完了していません。メール認証を完了してください。</p>
      )}
      {errorCode === 'no_mail' && (
        <p>メールアドレスが登録されていません。メールアドレスを登録してください。</p>
      )}
    </div>
  </>)
}