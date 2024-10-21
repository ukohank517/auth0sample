import { submitDeleteRequest, submitPatchRequest, submitPostRequest } from './Auth0Client';

export async function sentOtpToMail(mail: string): Promise<void> {
  const path = `/passwordless/start`
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'Accept': 'application/json',
  }
  const body = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    connection: 'email',
    email: mail,
    send: 'code',
    authParams: {
      scope: 'openid',
      state: 'test_state',
    }
  }

  const response = await submitPostRequest(path, headers, body);
}

export async function getIdTokenByOtpCode(mail: string, otpCode: string): Promise<string> {
  const path = `/oauth/token`
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  }
  const body = {
    grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    username: mail,
    realm: 'email',
    otp: otpCode,
  }

  const response = await submitPostRequest(path, headers, body);

  if(response?.id_token) {
    return response?.id_token;
  }else{
    return '';
  }
}

export async function sendResetPasswordMail(email: string): Promise<string> {
  const path = `/dbconnections/change_password`;
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    }
    const body: Record<string, string> = {
      client_id: process.env.AUTH0_CLIENT_ID || '',
      email: email,
      connection: 'Username-Password-Authentication',
    }
    const response = await submitPostRequest(path, headers, body) // const t = await response.text();
    console.log('password_reset response is only a text, not json!!!!!!!!!!!!!!!!!!!!', response);

    return response;
}

export async function setNewPassword(userId: string, newPassword: string){
  const path = `/api/v2/users/${userId}`;
  const headers: Record<string, string> = {
    'authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    'content-type': 'application/json',
  }
  const body: Record<string, string> = {
    password: newPassword,
    connection: 'Username-Password-Authentication',
  }

  const response = await submitPatchRequest(path, headers, body);
  return response;
}

// TODO: auth method はdatabase-connectonのみに限定する
export async function deleteMail(userId: string): Promise<void> {
  const path = `/api/v2/users/${userId}`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
  };

  const response = await submitDeleteRequest(path, headers, null);
}


export async function changeMail(user_id: string, newMail: string): Promise<void> {
  const path = `/api/v2/users/${user_id}`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'Authorization': `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
  };

  const body = {
    email: newMail,
    email_verified: true,
  }

  const response = await submitPatchRequest(path, headers, body);
}

export async function getManagementApiToken(): Promise<string> {
  const path = `/oauth/token`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const body = {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    grant_type: 'client_credentials',
  }

  const response = await submitPostRequest(path, headers, body);

  return response.access_token;
}