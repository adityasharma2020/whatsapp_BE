import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'please provide your email address'],
      unique: [true, 'This email address already exists'],
      lowerCase: true,
      validate: [validator.isEmail, 'please provide a valid email address'],
    },

    picture: {
      type: String,
      default:
        'https://pixlok.com/wp-content/uploads/2021/03/default-user-profile-picture.jpg',
    },
    status: {
      type: String,
      default: 'Hey there ! I am using Whatsapp',
    },
    password: {
      type: String,
      required: [true, 'Please provide your Password'],
      minLength: [
        6,
        'please make sure your password is atleast 6 characters long',
      ],
      maxLength: [
        128,
        'please make sure your password is less than 128 characters long',
      ],
    },
  },
  { collection: 'users', timestamps: true }
)

// do it only when new user is adding
userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
  } catch (error) {
    next(error)
  }
})

const UserModel =
  mongoose.models.UserModel || mongoose.model('userModel', userSchema)

export default UserModel
