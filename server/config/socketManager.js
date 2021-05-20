const io = require('./server').io;
const {
	userListController,
	chatController,
	groupController,
} = require('../controllers');
const { userListHandler } = require('../handlers');
const { factories } = require('../factories');
const APP_DEFAULTS = require('./app-defaults');

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
	socket.on(APP_DEFAULTS.SOCKET_EVENT.CREATE_USER_SOCKET, async (userId) => {
		tempUsers[userId] = socket;
		await userListHandler.makeUserOnline(userId);

		// await userListController.makeUserOnline(userId);
		// getAllUsers(user);
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
			let messageData;
			let messageObject;
			if (messageType == 'PRIVATE') {
				messageData = await chatController.saveNewMessage(
					roomID,
					sender,
					receiver,
					message
				);
				messageObject = factories.newPrivateMessage(messageData);
				tempUsers[receiver].emit('MESSAGE_COUNT', data['savedMsg']);
			} else {
				messageData = await groupController.saveNewMessage(
					sender,
					roomID,
					message
				);
				messageObject = factories.newGroupMessage(messageData);
			}
			io.in(roomID).emit('RECEIVE_MESSAGE', messageObject);
		}
	);

	socket.on('USER_TYPING_STATUS', (room, typingStatus, receiver) => {
		io.to(room).emit('TYPING_STATUS', typingStatus, receiver);
	});

	socket.on('JOIN_GROUP', async (groupName) => {
		socket.join(groupName);
		let groupMessages = await groupController.getGroupMessages(groupName);
		io.to(groupName).emit('SHOW_GROUP_MESSAGES', {
			groupName: groupName,
			groupMessages: groupMessages,
		});
	});
};
