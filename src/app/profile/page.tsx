'use client';

import { Row, Col, Button } from 'reactstrap';

import ErrorMessage from '@/components/parts/ErrorMessage';
import Loading from '@/components/parts/Loading';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { handleLogout } from '@auth0/nextjs-auth0';
import ProfileServer from '@/components/ProfileServer';

function Profile() {
  const { user, isLoading } = useUser();
  const [ authUrl, setAuthUrl ] = useState<string>('');
  const [ accountStatus, setAccountStatus ] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:3000/api/v2/auth0/check_status')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('data', data);
      setAccountStatus(data.status);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
  },[]);


  useEffect(() => {
    fetch('http://localhost:3000/api/v2/auth0/link/authorize_url')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('data', data);
      setAuthUrl(data.url);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
  }, []);


  const linkButtonClick = () => {
    // 遷移して認証処理を行う
    window.location.href = authUrl;
  }

  const [newPassword, setNewPassword] = useState(''); // 新しいパスワード
  const [resetResult, setResetResult] = useState('');

  const resetPassword = async () => {
    fetch('http://localhost:3000/api/v2/auth0/password_reset/set_new_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user?.sub,
        newPassword: newPassword,
      }),
    }).then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('data', data.updated_at);
      // 成功時処理
      setResetResult('更新日時:' + data.updated_at);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error
      );
    })

    for(let i = 5; i >= 0; i--){
      // 1秒待つ
      await new Promise(r => setTimeout(r, 1000));
      console.log(i, '...')
    }
    console.log('log out')
    window.location.href = 'http://localhost:3000/api/auth/logout';
  }

  const [oldMail, setOldMail] = useState(''); // 古いメールアドレス
  const [newMail, setNewMail] = useState(''); // 新しいメールアドレス
  const [oldOtp, setOldOtp] = useState(''); // 古いメールアドレスのOTP
  const [newOtp, setNewOtp] = useState(''); // 新しいメールアドレスのOTP
  const [changeMailResult, setChangeMailResult] = useState('');

  const onStartMailChange = async () => {
    setOldMail(user?.email || '');

    fetch('http://localhost:3000/api/v2/auth0/email_change/send_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldMail: oldMail,
        newMail: newMail,
      }),
    }).then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('OTP送信完了しました');
      console.log('data', data);
      // 成功時処理
      setChangeMailResult(data.message);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error
      );
    })
  }
  const onVerifyOtp = async () => {
    console.log('とりあえず真アカウントのチェックを行う')
    console.log('newMail', newMail);
    console.log('newOtp', newOtp);
    fetch('http://localhost:3000/api/v2/auth0/email_change/check_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: newMail,
        otpCode: newOtp,
      }),
    }).then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      console.log('OTP確認完了しました');
      console.log('data', data);
      // 成功時処理
      setChangeMailResult(data.message);
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error
      );
    })

  }


  return (
    <>
      {(authUrl === '' || isLoading) && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
            <Image
              src={user.picture || '/'}
              alt="Profile"
              className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
              width="200"
              height="200"
              data-testid="profile-picture"
            />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            {JSON.stringify(user, null, 2)}
          </Row>
          <Row>
            <Button color="primary" onClick={linkButtonClick}>
              アカウントリンク
            </Button>
          </Row>
          <p>--------------------------------------</p>
          <h2> メールアドレス変更 </h2>

          <Row>
            <input type="email" value={newMail} placeholder='new mail' onChange={(e) => setNewMail(e.target.value)} />
            <button onClick={onStartMailChange}>メールアドレス変更開始</button>
          </Row>

          <Row> <label>OLD[{oldMail}]: </label> <input type = "text" value={oldOtp} onChange={(e) => setOldOtp(e.target.value)} /></Row>
          <Row> <label>NEW[{newMail}]: </label> <input type = "text" value={newOtp} onChange={(e) => setNewOtp(e.target.value)} /></Row>
          <Row> <button onClick={onVerifyOtp}>OTP確認</button> </Row>
          <Row> <label>変更結果: {changeMailResult}</label> </Row>

          <p>--------------------------------------------------------------------------------</p>
          <h2>パスワードリセット</h2>
          <Row>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={resetPassword}>パスワードリセット</button>
          </Row>
          <label>リセット結果: {resetResult}</label>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});