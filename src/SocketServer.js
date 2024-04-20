/* 
    All Socket related functionalites .
    socket.io allow us to makes rooms, so that whetver we send
    is in that room only.so we make a room when the user connected .
*/

let onlineUsers = [];
export default function (socket, io) {
	//------------- user joins or opens the application--------------
	socket.on('join', (user) => {
		socket.join(user);
		//add joined user to online users
		if (!onlineUsers.some((u) => u.userId === user)) {
			onlineUsers.push({ userId: user, socketId: socket.id });
		}
		//send online users to frontend
		io.emit('get-online-users', onlineUsers);
		//send socket id
		io.emit('setup socket', socket.id);
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
		if (!message?.conversation) return;
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

	// ----------------Calling ---------------------
	//call user
	socket.on('call user', (data) => {
		let userId = data?.userToCall;
		// now we have the db id of the user to whom we want to call ,
		// now we have to check whether this user is online or not, so we check our online array and find its socket id.
		let userSocketId = onlineUsers.find((user) => user.userId === userId);
		if (!userSocketId) {
			console.log('User is not online');
			return; // Exit the function early if user is not online
		}
		console.log('usersocketId::', userSocketId);
		io.to(userSocketId.socketId).emit('call user', {
			signal: data.signal,
			from: data.from,
			name: data.name,
			picture: data.picture,
		});
	});

	//answer call
	socket.on('answer call', (data) => {
		io.to(data.to).emit('call accepted', data.signal);
	});
}
