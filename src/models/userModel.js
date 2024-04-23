/* 
 * collection: 'users' : it specifies that documents based on this schema will be stored
   in a collection named 'users'. If we dont provde mongoose by default  will pluralize the naem of schema 
   for naming.
 * timestamps: true   : adds two fields to each document: createdAt and updatedAt.

 * mongoose.models.UserModel || mongoose.model('userModel', userSchema) : The purpose of using this line of code is to ensure 
   that only one instance of the UserModel is created.
    This is important because if you re-import or re-define the model elsewhere in your code, you could end up with 
    multiple conflicting instances of the same model, leading to potential issues like schema overwrites or multiple connections to the database.

  * salt : As we also want to convert the password to normal state and compare . so , we should make an balance 
    such that salt is good enough to make password secure as well.

    
*/

import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide your name'],
		},
		email: {
			type: String,
			required: [true, 'Please provide tour email address'],
			unqiue: [true, 'This email address already exist'],
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid email address'],
		},
		picture: {
			type: String,
			default:
				'https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png',
		},
		status: {
			type: String,
			default: 'Hey there ! I am using whatsapp',
		},
		mobile: {
			type: String,
			required: [true, 'Please provide mobile number'],
		},
		password: {
			type: String,
			required: [true, 'Please provide your password'],
			minLength: [6, 'Plase make sure your password is atleast 6 characters long'],
			maxLength: [128, 'Plase make sure your password is less than 128 characters long'],
		},
	},
	{
		collection: 'users',
		timestamps: true,
	}
);
userSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
		next();
	} catch (error) {
		next(error);
	}
});
const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;
