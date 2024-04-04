import { sign,verify } from '../utils/token.util.js'

//here we call the sign function and if we want to do something with the coming
//data we can do here .
export const generateToken = async (payload, expiresIn, secret) => {
  let token = await sign(payload, expiresIn, secret)
  return token
}

export const verifyToken = async (token, secret) => {
  let check = await verify(token, secret)
  return check
}
