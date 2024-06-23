'use client';

import { Row, Col, Button } from 'reactstrap';

import ErrorMessage from '@/components/parts/ErrorMessage';
import Loading from '@/components/parts/Loading';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function Profile() {
  const { user, isLoading } = useUser();
  const [authUrl, setAuthUrl] = useState<string>('');

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

  // const domain = 'https://dev-pze81xi6nzpfviz1.us.auth0.com';

  // const data: Record<string, string> = {
  //   prompt: 'login', // 既存の認証情報を無視して再度認証処理を行う
  //   response_type: 'code',
  //   client_id: 'aGq47dREKroosw7Q5tJUFtby2t9yIV4y',
  //   redirect_uri: 'http://localhost:3000/api/auth/link/callback', // ローカルのテスト用に
  //   audience: 'https://dev-pze81xi6nzpfviz1.us.auth0.com/api/v2/',
  //   code_challenge: 'd5sBYVQMjQ2VDvKYlO0Y_2zvvA_ZwSMm9TEp6mRh31o', // hello.ts で生成した値、テストのため固定
  //   // verifier: 'TJh6gqs99c6FCQ3NdfDYE7Umk1BysyH1mm-RrcTKJ5A', // challengeのペア、テストのため固定
  //   code_challenge_method: 'S256',
  //   scope: 'openid profile email appointments contacts',
  //   state: 'xyzABC123'
  // }

  const linkButtonClick = () => {
    // 遷移して認証処理を行う
    window.location.href = authUrl;
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
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});