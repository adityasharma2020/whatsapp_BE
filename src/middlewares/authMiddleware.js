import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export default async function (req, res, next) {
  if (!req.headers['authorization']) return next(createHttpError.Unauthorized())
  const bearerToken = req.headers['authorization']
  const token = bearerToken.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized())
    }

    //here we are adding some meta data to the req header for subsequent middleware
    req.user = payload
    next()
  })
}
