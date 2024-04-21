/* 
    All Socket related functionalites .
    socket.io allow us to makes rooms, so that whetver we send
    is in that room only.so we make a room when the user connected .
*/
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

	// -----piyush call funcitons----
	socket.on('user:call', ({ to, offer }) => {
		let toUser = onlineUsers.find((user) => user.userId == to);

		io.to(toUser.socketId).emit('incoming:call', {
			from: socket.id,
			offer: offer,
		});
	});

	socket.on('call:accepted', ({ to, ans }) => {
		io.to(to).emit('call:finallyAccepted', { from: socket.id, ans: ans });
	});

	socket.on('peer:negotiate:needed', ({ to, offer }) => {
		let toUser = onlineUsers.find((user) => user.userId == to);
		console.log('negotiateeeee:::::', to, offer);
		io.to(to).emit('peer:negotiate:neededFinally', { from: socket.id, offer: offer });
	});
	
	socket.on('peer:nego:done', ({ to, ans }) => {
		console.log('negotiate Donee:::::', to, ans);
		io.to(to).emit('peer:nego:final', { from: socket.id, ans });
	});

	// ------------------------------------------------------

	//call
	socket.on('call user', (data) => {
		let userId = data.userToCall;
		let userSocketId = onlineUsers.find((user) => user.userId == userId);
		io.to(userSocketId.socketId).emit('call user', {
			signal: data.signal,
			from: data.from,
			name: data.name,
			picture: data.picture,
		});
	});
	//---answer call
	socket.on('answer call', (data) => {
		io.to(data.to).emit('call accepted', data.signal);
	});

	//---end call
	socket.on('end call', (id) => {
		io.to(id).emit('end call');
	});
}
