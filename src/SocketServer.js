/* 
    All Socket related functionalites .
    socket.io allow us to makes rooms, so that whetver we send
    is in that room only.so we make a room when the user connected .
*/

export default function (socket) {
	// user joins or opens the application
	socket.on('join', (user_id) => {
		console.log('user has joined: ', user_id);
		socket.join(user_id);
	});

	//join a conversation room
	socket.on('join conversation', (conversation_id) => {
		socket.join(conversation_id);
		console.log('user has joined conversaation: ', conversation_id);
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
}
