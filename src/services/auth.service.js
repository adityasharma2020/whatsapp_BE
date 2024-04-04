import createHttpError from 'http-errors'
import validator from 'validator'
import { UserModel } from '../models/index.js'
import bcrypt from 'bcrypt'

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env

export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData

  //   ----------------------validations---------------------------
  //check if fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest('please fill all fields')
  }

  //check name length
  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest(
      'please make sure you name is between 2 and 16 characters...'
    )
  }

  //check status length
  if (status && status.length > 64) {
    throw createHttpError.BadRequest(
      'Please make sure your status is less than 64 characters'
    )
  }

  //check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      'Please make sure to provide a valid email address'
    )
  }

  //check if user already exits
  const checkDb = await UserModel.findOne({ email })
  if (checkDb) {
    throw createHttpError.Conflict(
      'please try again with a different email address, this email is already registered'
    )
  }

  //check password length
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest(
      'please make sure your password is between 6 and 128 characters..'
    )
  }

  //hash password ----> to be done in the user model

  // -------------------adding user to the database--------------------
  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save()

  return user
}

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean()

  //check if user/email exists
  if (!user) {
    throw createHttpError.NotFound('Invalid credentials')
  }

  //compare passwords
  let passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) throw createHttpError.NotFound('Invalid password')

  return user
}
