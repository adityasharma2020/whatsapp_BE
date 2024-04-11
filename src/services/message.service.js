import createHttpError from 'http-errors';
import { MessageModel } from '../models/index.js';

export const createMessage = async (data) => {
	let newMessage = await MessageModel.create(data);

	if (!newMessage) throw createHttpError.BadRequest('Oops...something went wrong.');

	return newMessage;
};

export const populateMessage = async (id) => {
	let msg = await MessageModel.findById(id)
		.populate({
			path: 'sender',
			select: 'name picture ',
			model: 'UserModel',
		})
		.populate({
			path: 'conversation',
			select: 'name isGroup',
			model: 'ConversationModel',
			populate: {
				path: 'users',
				select: 'name email picture status',
				model: 'UserModel',
			},
		});

	if (!msg) throw createHttpError.BadRequest('Oops...something went wrong.');
	return msg;
};
