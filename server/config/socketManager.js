const io = require('./server').io;
const {
	userListController,
	chatController,
	groupController,
} = require('../controllers');
const { factories } = require('../factories');

let tempUsers = {};

getAllUsers = async (username) => {
	let privateUsers = await userListController.showAllActiveUsers(username);
	let userGroups = await groupController.getUserGroups(username);
	let data = { privateUsers: privateUsers, userGroups: userGroups };
	io.emit('CONNECTED_USERS', data);
};

deleteConnectedUser = async (socket) => {
	const { username } = socket;
	delete tempUsers[`${username}`];

	if (username) {
		await userListController.makeUserOffline(username);
		getAllUsers(username);
	}
};

module.exports.SocketManager = (socket) => {
	socket.on('SET_USER_SOCKET', async (user) => {
		socket.username = user;
		tempUsers[`${user}`] = socket;

		await userListController.makeUserOnline(user);
		getAllUsers(user);
	});

	socket.on('disconnect', async () => {
		deleteConnectedUser(socket);
	});

	socket.on('JOIN_ROOM', async (roomID, sender, receiver, fullName) => {
		socket.join(roomID);
		let roomMessages = await chatController.getParticularRoomMessages(
			roomID,
			sender,
			receiver
		);
		io.to(roomID).emit(
			'SHOW_USER_MESSAGES',
			roomMessages,
			receiver,
			roomID,
			fullName
		);
	});

	socket.on('LOGOUT_USER', async () => {
		deleteConnectedUser(socket);
	});

	socket.on(
		'SEND_MESSAGE',
		async (sender, receiver, message, roomID, messageType) => {
			let data;
			if (messageType == 'PRIVATE') {
				data = await chatController.saveNewMessage(
					roomID,
					sender,
					receiver,
					message
				);
			} else {
				data = await groupController.saveNewMessage(
					sender,
					roomID,
					message
				);
			}
			messageObject = factories.newMessage(data);
			io.in(roomID).emit('RECEIVE_MESSAGE', messageObject);
			tempUsers[receiver].emit('MESSAGE_COUNT', data['savedMsg']);
		}
	);

	socket.on('USER_TYPING_STATUS', (room, typingStatus, receiver) => {
		io.to(room).emit('TYPING_STATUS', typingStatus, receiver);
	});

	socket.on('JOIN_GROUP', async (groupName, sender) => {
		socket.join(groupName);
		let groupMessages = await groupController.getGroupMessages(groupName);
		io.to(groupName).emit('SHOW_GROUP_MESSAGES', {
			groupName: groupName,
			groupMessages: groupMessages,
		});
	});
};
