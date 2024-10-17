import jwt, { JwtPayload } from 'jsonwebtoken';

// npm install jsonwebtoken
// npm install --save-dev @types/jsonwebtoken
export async function getUserIdFromIdToken(idToken: string) {
  const decodedToken = await jwt.decode(idToken) as JwtPayload;

  if(decodedToken && decodedToken.sub){
    return decodedToken.sub;
  } else {
    return null;
  }
}