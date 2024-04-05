/* 
here we call the sign function from utils to generate the jwt token ,
 and if we want to do something with the coming data we can do here as it is service layer.
 
  while JWTs can be decoded, they are not intended to be a means of securely transmitting sensitive information. 
  Instead, they provide a secure and efficient way to authenticate and authorize users, reducing the overhead of 
  transmitting credentials with each request and minimizing database calls by including relevant user information within
   the token itself. However, it's essential to implement proper security measures, such as using HTTPS, validating tokens
    on the server-side, and carefully managing token expiration and revocation, to ensure the security of your application.

    Even though JWTs can be decoded, modifying the payload or signature would invalidate the token, making it unusable.
*/

import { sign, verify } from '../utils/token.util.js';

export const generateToken = async (payload, expiresIn, secret) => {
	let token = await sign(payload, expiresIn, secret);
	return token;
};

export const verifyToken = async (token, secret) => {
	let check = await verify(token, secret);
	return check;
};
