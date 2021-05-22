const mongoose = require('mongoose');
const moment = require('moment');

const io = require('./server').io;
const { userListController, groupController } = require('../controllers');
const { userListHandler } = require('../handlers');
const APP_DEFAULTS = require('./app-defaults');
const Schema = require('../schemas');

const { queries } = require('../db');

let connectedUsers = {};

getAllUsers = async (username) => {
	let privateUsers = await userListController.showAllActiveUsers(username);
	let userGroups = await groupController.getUserGroups(username);
	let data = { privateUsers: privateUsers, userGroups: userGroups };
	io.emit('CONNECTED_USERS', data);
};

deleteConnectedUser = async (socket) => {
	const { userId } = socket;
	delete connectedUsers[userId];

	if (userId) {
		await userListController.makeUserOffline(userId);
		// getAllUsers(username);
	}
};

module.exports.SocketManager = (socket) => {
	socket.on(APP_DEFAULTS.SOCKET_EVENT.CREATE_USER_SOCKET, async (userId) => {
		socket.userId = userId;
		connectedUsers[userId] = socket;
		await userListHandler.makeUserOnline(userId);

		// await userListController.makeUserOnline(userId);
		// getAllUsers(user);
	});

	socket.on(APP_DEFAULTS.SOCKET_EVENT.LOGOUT_USER, async () => {
		deleteConnectedUser(socket);
	});

	socket.on('disconnect', async () => {
		deleteConnectedUser(socket);
	});

	socket.on(
		APP_DEFAULTS.SOCKET_EVENT.JOIN_ROOM,
		async (roomID, sender, receiver) => {
			socket.join(roomID);

			let query = { _id: mongoose.Types.ObjectId(receiver) };
			let projections = { firstName: 1, lastName: 1 };
			let options = { lean: true };

			let receiverDetails = await queries.findOne(
				Schema.users,
				query,
				projections,
				options
			);

			query = { room: roomID };
			projections = {
				text: 1,
				createdDate: 1,
				sender: 1,
				receiver: 1,
				isRead: 1,
			};
			let collectionOptions = [
				{ path: 'sender', select: 'firstName lastName' },
				{ path: 'receiver', select: 'firstName lastName' },
			];

			let roomMessages = await queries.populateData(
				Schema.chats,
				query,
				projections,
				options,
				collectionOptions
			);

			let conditions = {
				room: roomID,
				isRead: false,
				sender: mongoose.Types.ObjectId(receiver),
			};
			let toUpdate = {
				isRead: true,
				isReadDate: moment().valueOf(),
				modifiedDate: moment().valueOf(),
			};
			await queries.findAndUpdate(Schema.chats, conditions, toUpdate, options);

			let socketArgs = { receiverDetails, roomID, roomMessages };
			io.to(roomID).emit(
				APP_DEFAULTS.SOCKET_EVENT.RECEIVE_MESSAGES,
				socketArgs
			);
		}
	);

	socket.on('SEND_MESSAGE', async (socketData) => {
		let newMessage = socketData;

		let message = await queries.create(Schema.chats, newMessage);

		let query = { _id: mongoose.Types.ObjectId(message._id) };
		let projections = {
			text: 1,
			createdDate: 1,
			sender: 1,
			receiver: 1,
			isRead: 1,
			room: 1,
		};
		let options = { lean: true };
		let collectionOptions = [
			{ path: 'sender', select: 'firstName lastName' },
			{ path: 'receiver', select: 'firstName lastName' },
		];

		newMessage = await queries.populateData(
			Schema.chats,
			query,
			projections,
			options,
			collectionOptions
		);

		let newSocketData = { newMessage: newMessage[0] };
		console.log(message.room);

		io.to(message.room).emit(
			APP_DEFAULTS.SOCKET_EVENT.RECEIVE_NEW_MESSAGE,
			newSocketData
		);
		// let messageData;
		// let messageObject;
		// if (messageType == 'PRIVATE') {
		// 	messageData = await chatController.saveNewMessage(
		// 		roomID,
		// 		sender,
		// 		receiver,
		// 		message
		// 	);
		// 	messageObject = factories.newPrivateMessage(messageData);
		// 	connectedUsers[receiver].emit('MESSAGE_COUNT', data['savedMsg']);
		// } else {
		// 	messageData = await groupController.saveNewMessage(
		// 		sender,
		// 		roomID,
		// 		message
		// 	);
		// 	messageObject = factories.newGroupMessage(messageData);
		// }
		// io.in(roomID).emit('RECEIVE_MESSAGE', messageObject);
	});

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
