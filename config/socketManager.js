const mongoose = require('mongoose');
const moment = require('moment');
const socket = require('socket.io');

const { userListHandler } = require('../handlers');
const { APP_DEFAULTS } = require('../constants');
const Schema = require('../schemas');
const { queries } = require('../db');

let connectedUsers = {};
let io;

const getPrivateRoomMessage = async (messageId) => {
	let query = { _id: mongoose.Types.ObjectId(messageId) };
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

	let newMessage = await queries.populateData(
		Schema.chats,
		query,
		projections,
		options,
		collectionOptions
	);

	return newMessage;
};

const getGroupRoomMessage = async (messageId) => {
	let query = { _id: mongoose.Types.ObjectId(messageId) };
	let projections = {
		text: 1,
		createdDate: 1,
		sender: 1,
		room: 1,
	};

	let options = { lean: true };
	let collectionOptions = [{ path: 'sender', select: 'firstName lastName' }];

	let newMessage = await queries.populateData(
		Schema.groupChat,
		query,
		projections,
		options,
		collectionOptions
	);

	return newMessage;
};

const deleteConnectedUser = async (socket) => {
	const { userId } = socket;
	delete connectedUsers[userId];

	if (userId) {
		await userListHandler.makeUserOffline(userId);
		return userId;
	}
	return null;
};

const SocketManager = (socket) => {
	socket.on(APP_DEFAULTS.SOCKET_EVENT.CREATE_USER_SOCKET, async (userId) => {
		socket.userId = userId;
		connectedUsers[userId] = socket;


		const userDetails = await userListHandler.makeUserOnline(userId);

		const socketData = {
			userId,
			status: APP_DEFAULTS.ACTIVE_STATUS.ONLINE,
		};

		const userData = {
			firstName: userDetails.firstName,
			lastName: userDetails.lastName
		}

		socket.broadcast.emit(APP_DEFAULTS.SOCKET_EVENT.ONLINE_STATUS, socketData);

		connectedUsers[userDetails._id].emit(APP_DEFAULTS.SOCKET_EVENT.SOCKET_USER_DATA, userData);
	});

	socket.on(APP_DEFAULTS.SOCKET_EVENT.LOGOUT_USER, async () => {
		let userId = await deleteConnectedUser(socket);
		if (userId) {
			let socketData = { userId, status: APP_DEFAULTS.ACTIVE_STATUS.OFFLINE };

			io.emit(APP_DEFAULTS.SOCKET_EVENT.ONLINE_STATUS, socketData);
		}
	});

	socket.on('disconnect', async () => {
		let userId = await deleteConnectedUser(socket);

		if (userId) {
			let socketData = { userId, status: APP_DEFAULTS.ACTIVE_STATUS.OFFLINE };

			io.emit(APP_DEFAULTS.SOCKET_EVENT.ONLINE_STATUS, socketData);
		}
	});

	socket.on(
		APP_DEFAULTS.SOCKET_EVENT.JOIN_PRIVATE_ROOM,
		async (roomID, sender, receiver) => {

			socket.join(roomID);

			const aggregateData = [
				{ $match: { _id: mongoose.Types.ObjectId(receiver) } },
				{
					$project: {
						name: {
							$concat: [
								{
									$concat: [
										{ $toUpper: { $substrCP: ['$firstName', 0, 1] } },
										{
											$substrCP: [
												'$firstName',
												1,
												{ $subtract: [{ $strLenCP: '$firstName' }, 1] },
											],
										},
									],
								},
								' ',
								{
									$concat: [
										{ $toUpper: { $substrCP: ['$lastName', 0, 1] } },
										{
											$substrCP: [
												'$lastName',
												1,
												{ $subtract: [{ $strLenCP: '$lastName' }, 1] },
											],
										},
									],
								},
							],
						},
					},
				},
			];

			let options = { lean: true };

			const receiverDetails = await queries.aggregateData(
				Schema.users,
				aggregateData,
				options
			);

			query = [
				{ $match: { room: roomID } },
				{
					$addFields: {
						isSender : {
							$cond: [
								{ $eq: [ "$sender", new mongoose.Types.ObjectId(sender) ] },
								1,
								0
							]
						}
					}
				},
				{
					$match : {
						$or : [
							{ $and : [{ isSender : 0 }, { toDelete : false }] },
							{ $and : [{ isSender : 1 }, { fromDelete : false }] },
						]
					}
				},
				{
					$project: {
						text: 1,
						createdDate: 1,
						sender: 1,
						receiver: 1,
						isRead: 1,
						fromDelete: 1,
						toDelete: 1,
					}
				}
			];

			projections = {
				text: 1,
				createdDate: 1,
				sender: 1,
				receiver: 1,
				isRead: 1,
				fromDelete: 1,
				toDelete: 1,
			};

			const projectionOptions = [
				{ path: 'sender', select: 'firstName lastName' },
				{ path: 'receiver', select: 'firstName lastName' },
			];

			let roomMessages = await queries.aggregateDataWithPopulate(
				Schema.chats,
				query,
				projectionOptions
			);

			const conditions = {
				room: roomID,
				isRead: false,
				sender: mongoose.Types.ObjectId(receiver),
			};

			const toUpdate = {
				isRead: true,
				isReadDate: moment().valueOf(),
				modifiedDate: moment().valueOf(),
			};
			await queries.updateMany(Schema.chats, conditions, toUpdate, options);

			let socketArgs = {
				receiverDetails: receiverDetails[0],
				roomID,
				roomMessages,
			};

			io.to(roomID).emit(
				APP_DEFAULTS.SOCKET_EVENT.RECEIVE_MESSAGES,
				socketArgs
			);

			let lastMessage = roomMessages.length ?  roomMessages[roomMessages.length - 1]: {};

			socketArgs = {
				newMessagesCount: 0,
				id: receiver,
				text: lastMessage.text,
				createdDate: lastMessage.createdDate,
			};

			io.to(roomID).emit(
				APP_DEFAULTS.SOCKET_EVENT.PRIVATE_MESSAGES_COUNT,
				socketArgs
			);
		}
	);

	socket.on(APP_DEFAULTS.SOCKET_EVENT.SEND_MESSAGE, async (socketData) => {
		if (socketData.receiver !== null) {
			const message = await queries.create(Schema.chats, socketData);

			const newMessage = await getPrivateRoomMessage(message._id);

			const conditions = {
				room: newMessage[0].room,
				sender: mongoose.Types.ObjectId(newMessage[0].sender._id),
				isRead: false,
			};
			const count = await queries.countDocuments(Schema.chats, conditions);

			const newSocketData = { newMessage: newMessage[0] };

			io.to(message.room).emit(
				APP_DEFAULTS.SOCKET_EVENT.RECEIVE_NEW_MESSAGE,
				newSocketData
			);

			const receiverSocket = connectedUsers[newMessage[0].receiver._id];

			if (receiverSocket) {
				let receiverSocketData = {
					newMessagesCount: count,
					id: newMessage[0].sender._id,
					createdDate: message.createdDate,
					text: message.text,
				};
				io.to(receiverSocket.id).emit(
					APP_DEFAULTS.SOCKET_EVENT.PRIVATE_MESSAGES_COUNT,
					receiverSocketData
				);
			}
		} else {

			const message = await queries.create(Schema.groupChat, socketData);

			const newMessage = await getGroupRoomMessage(message._id);

			const conditions = {
				room: newMessage[0].room,
				sender: mongoose.Types.ObjectId(newMessage[0].sender._id),
				isRead: false,
			};

			const count = await queries.countDocuments(Schema.groupChat, conditions);

			const newSocketData = { newMessage: newMessage[0] };

			io.to(message.room).emit(
				APP_DEFAULTS.SOCKET_EVENT.RECEIVE_NEW_MESSAGE,
				newSocketData
			);

			const receiverSocketData = {
				newMessagesCount: count,
				id: newMessage[0].sender._id,
				createdDate: message.createdDate,
				text: message.text,
			};

			io.to(message.room).emit(
				APP_DEFAULTS.SOCKET_EVENT.GROUP_MESSAGES_COUNT,
				receiverSocketData
			);
		}
	});

	socket.on(APP_DEFAULTS.SOCKET_EVENT.JOIN_GROUP_ROOM, async (socketData) => {

		socket.join(socketData.groupId);

		let query = { _id: mongoose.Types.ObjectId(socketData.groupId) };
		let projections = { name: 1 };
		const options = { lean: true };

		const groupDetails = await queries.findOne(
			Schema.groupDetails,
			query,
			projections,
			options
		);

		query = { room: socketData.groupId };
		projections = {
			text: 1,
			createdDate: 1,
			sender: 1,
		};
		const collectionOptions = [{ path: 'sender', select: 'firstName lastName' }];

		const roomMessages = await queries.populateData(
			Schema.groupChat,
			query,
			projections,
			options,
			collectionOptions
		);

		const socketArgs = {
			receiverDetails: { name: groupDetails.name, _id: null },
			roomID: socketData.groupId,
			roomMessages,
		};

		io.to(socketData.groupId).emit(
			APP_DEFAULTS.SOCKET_EVENT.RECEIVE_MESSAGES,
			socketArgs
		);
	});

	socket.on(APP_DEFAULTS.SOCKET_EVENT.USER_TYPING_STATUS, (room, typingStatus, receiver) => {
		io.to(room).emit(APP_DEFAULTS.SOCKET_EVENT.TYPING_STATUS, typingStatus, receiver);
	});

	socket.on(
		APP_DEFAULTS.SOCKET_EVENT.DELETE_PRIVATE_MESSAGE,
		async (messageId, sender) => {

			const projections = {sender: 1, receiver:1 };
			const options = { lean: true, new: true };
			const conditions = { _id: mongoose.Types.ObjectId(messageId) };
			let toUpdate = {};

			const messageDetails = await queries.findOne(Schema.chats, conditions, projections, options);

			if(messageDetails.sender == sender) {
				toUpdate = { fromDelete: true };
			}
			else {
				toUpdate = { toDelete: true };
			}

			const specificSocket = connectedUsers[sender];

			if(specificSocket) {
				io.to(specificSocket.id).emit(APP_DEFAULTS.SOCKET_EVENT.UPDATE_DELETED_PRIVATE_MESSAGE, messageId);
			}

			await queries.findAndUpdate(Schema.chats, conditions, { $set: toUpdate }, options);
		});
};

const createConnection = (server) => {

	io = socket(server);
	io.on('connection', SocketManager);
};

const addGroupToGroupList = (groupMembers, groupData) => {

	for(const userId of groupMembers) {

		if(userId in connectedUsers) {

			io.to(connectedUsers[userId].id).emit(APP_DEFAULTS.SOCKET_EVENT.ADD_GROUP_TO_GROUPLIST, groupData);
		}
	}
};

module.exports = {
	createConnection,
	addGroupToGroupList,
}
