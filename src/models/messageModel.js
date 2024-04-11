import Mongoose from 'mongoose';
const { ObjectId } = Mongoose.Schema.Types;

const messageSchema = Mongoose.Schema(
	{
		sender: {
			type: ObjectId,
			ref: 'UserModel',
		},
		message: {
			type: String,
			trim: true,
		},
		conversation: {
			type: ObjectId,
			ref: 'ConversationModel',
		},
		files: [],
	},
	{
		collection: 'messages',
		timestamps: true,
	}
);

const MessageModel = Mongoose.model.MessageModel || Mongoose.model('MessageModel', messageSchema);

export default MessageModel;
