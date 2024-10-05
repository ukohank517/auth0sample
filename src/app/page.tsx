'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ result, setResult ] = useState('Result text');

  const { user, isLoading } = useUser();

  useEffect(() => {
    console.log('user', user);
  }
  , [user]);

  const onClickSignUp = () => {
    fetch('http://localhost:3000/api/v2/auth0/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('data', data);
      setResult(JSON.stringify(data));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
  }


  // send reset password email
  const [ resetEmail, setResetEmail ] = useState('');
  const [ resetResult, setResetResult ] = useState('Result text');
  const onClickResetPassword = () => {
    fetch('http://localhost:3000/api/v2/auth0/password_reset/send_mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: resetEmail }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('data', data);
      setResetResult(JSON.stringify(data));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
  }

  return (
    <>
    {user && user.email_verified && (
        <p> welcome {user?.name}</p>
    )}
    {user && !user.email_verified && (
        <p> please verify your email {user?.email}</p>
    )}
    {!isLoading && !user && (
      <>
      <h1>Default Test Page.</h1>
      <p>-----------------------------</p>
      <div>
        <h2>SignUp</h2>
        <p>メアドとパスワードを入れると。ユーザーが登録されます。しかしこの時ユーザ属性では email_verifiedがfalseと なっています</p>
        <p>ユーザーのメアドに認証リンクが同時に発行され、ユーザーが該リンクを開くと、email_verifiedがtrueとなります</p>
        <p>※ ユーザ属性判定はフロント側で実施して欲しい</p>
        <p>※ ユーザー名長さ、パスワードの強度設定は、</p>
        <p>管理者画面 &gt; Authentication &gt; Database &gt; Authentication Methods &gt; Password [configure] </p>
        <input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={onClickSignUp}>SignUp</button>
      </div>
      <label>Result: {result}</label>
      <p>-----------------------------</p>
      <div>
        <h2>Forget password?</h2>
        <p>メアドを入れると、指定メアドにパスワード変更のリンクが送信されます。ユーザーはそのリンクをクリックしてパスワード変更できます。</p>
        <p>※メール本文の修正は</p>
        <p>管理者画面 &gt; Branding &gt; Email Templates</p>
        <input type="text" placeholder="Enter your email to reset password" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
        <button onClick={onClickResetPassword}>Reset Password</button>
      </div>
      <label>Result: {resetResult}</label>
      </>
    )}
    </>
  );
}
