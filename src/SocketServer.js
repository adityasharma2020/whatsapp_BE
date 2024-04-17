/* 
    All Socket related functionalites .
    socket.io allow us to makes rooms, so that whetver we send
    is in that room only.so we make a room when the user connected .
*/

let onlineUsers = [];
export default function (socket, io) {
	//------------- user joins or opens the application--------------
	socket.on('join', (user_id) => {
		socket.join(user_id);

		//add joined user to online users
		if (!onlineUsers.some((u) => u.userId === user_id)) {
			onlineUsers.push({ userId: user_id, socketId: socket.id });
		}

		// send online users to frontend
		io.emit('get-online-users', onlineUsers);
	});

	// -------------user disconnected-----------------------------------

	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
		//here we use io to emit , as that socket is disconnect so we cant use that for emitting to other sockets
		io.emit('get-online-users', onlineUsers);
	});

	//------------------user join a conversation room----------------
	socket.on('join conversation', (conversation) => {
		socket.join(conversation);
	});

	//-------------user send and receive message--------------------
	socket.on('send message', (message) => {
		if(!message?.conversation) return;
		let conversation = message.conversation;
		if (!conversation.users) return;
		conversation.users.forEach((user) => {
			if (user._id === message.sender._id) return;
			socket.in(user._id).emit('receive message', message);
		});
	});

	//typing
	socket.on('typing', (conversation) => {
		console.log('typing');
		socket.in(conversation).emit('typing', conversation);
	});
	socket.on('stop typing', (conversation) => {
		console.log('stop typing');
		socket.in(conversation).emit('stop typing');
	});
}
