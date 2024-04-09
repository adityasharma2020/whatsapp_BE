/* 
	{ users: { $eleMatch: { $eq: sender_id } } }: This part checks if the users array contains
	an element that matches the sender_id. $eleMatch is used to match elements in an array, and $eq 
	is used to compare values.

	path: 'latestMessage.sender': This specifies the field you want to enrich with more details.

	select: 'name email picture status': This part specifies exactly which details you want to fill in about the sender.
*/

// import createHttpError from 'http-errors';
// import { ConversationModel, UserModel } from '../models/index.js';

// export const doesConversationExist = async (sender_id, receiver_id) => {
	
// 	let convos = await ConversationModel.find({
// 		isGroup: false,
// 		$and: [
// 			{ users: { $elemMatch: { $eq: sender_id } } },
// 			{ users: { $elemMatch: { $eq: receiver_id } } },
// 		],
// 	})
// 		.populate('users', '-password')
// 		.populate('latestMessage');

// 	if (!convos)
// 		throw createHttpError.BadRequest(
// 			'Oops... Something went wrong while getting the conversation!'
// 		);

// 	// populate message model
// 	convos = await UserModel.populate(convos, {
// 		path: 'latestMessage.sender',
// 		select: 'name email picture status',
// 	});

// 	return convos[0];
// };

// export const createConversation = async (data) => {
// 	const newConvo = await ConversationModel.create(data);
// 	if (!newConvo)
// 		throw createHttpError.BadRequest(
// 			'Oops..something went wrong while making a new conversation.'
// 		);

// 	return newConvo;
// };

// export const populateConversation = async (id, fieldToPopulate, fieldsToRemove) => {
// 	console.log("inside populate onveraton fun");
// 	const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
// 		fieldToPopulate,
// 		fieldsToRemove
// 	);
// 	if (!populatedConvo) {
// 		throw createHttpError.BadRequest(
// 			'Oops..something went wrong while making a new conversation.'
// 		);
// 	}
// 	return populatedConvo;
// };


import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  //populate message model
  convos = await UserModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return populatedConvo;
};