/* 
    All Socket related functionalites .
    socket.io allow us to makes rooms, so that whetver we send
    is in that room only.so we make a room when the user connected .
*/

import { MessageModel } from './models/index.js';
let onlineUsers = [];
export default function (socket, io) {
	//user joins or opens the application
	socket.on('join', (user) => {
		socket.join(user);
		//add joined user to online users
		if (!onlineUsers.some((u) => u.userId === user)) {
			onlineUsers.push({ userId: user, socketId: socket.id });
		}
		//send online users to frontend
		io.emit('get-online-users', onlineUsers);

		//send socket id
		io.to(socket.id).emit('setup socket', socket.id);
	});

	//socket disconnect
	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
		io.emit('get-online-users', onlineUsers);
	});

	//join a conversation room
	socket.on('join conversation', (conversation) => {
		socket.join(conversation);
	});

	//send and receive message
	socket.on('send message', (message) => {
		let conversation = message.conversation;
		
		if (!conversation.users) return;
		conversation.users.forEach((user) => {
			if (user._id === message.sender._id) return;
			socket.in(user._id).emit('receive message', message);
		});
	});

	//typing
	socket.on('typing', (conversation) => {
		socket.in(conversation).emit('typing', conversation);
	});
	socket.on('stop typing', (conversation) => {
		socket.in(conversation).emit('stop typing');
	});

	socket.on('messages seen', async ({ convo_id, chatUserId }) => {
		console.log('server::inside messages seen');
		try {
			const updatedMessages = await MessageModel.updateMany(
				{ conversation: convo_id, seen: false, sender: chatUserId },
				{ $set: { seen: true } }
			);
			console.log(updatedMessages);
			let chatUserSocket = onlineUsers.find((user) => user.userId === chatUserId);
			socket.to(chatUserSocket.socketId).emit('messages seen', { convo_id });
		} catch (error) {
			console.log('error while updating seen messages');
		}
	});
	//----------------------------------

	socket.on('call user', (data) => {
		let userId = data.userToCall;
		let userSocketId = onlineUsers.find((user) => user.userId === userId);
		io.to(userSocketId.socketId).emit('incoming call', {
			signal: data.signal,
			from: data.from,
			to: userSocketId.socketId,
			name: data.name,
			picture: data.picture,
		});
	});

	socket.on('not responded', ({ to }) => {
		console.log('server:not responded', to);
		socket.to(to).emit('not responded');
	});
	socket.on('call rejected', ({ to }) => {
		socket.to(to).emit('call rejected');
	});

	//---answer call
	socket.on('answer call', ({ signal, to }) => {
		console.log('server:::inside answer call');
		io.to(to).emit('call accepted', signal);
	});

	//---end call
	socket.on('end call', (id) => {
		console.log('server:::inside end call');
		io.to(id).emit('end call');
	});
}
