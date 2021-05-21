const mongoose = require('mongoose');

const { queries } = require('../db');
const Schema = require('../schemas');
const { userModel, userChatsModel } = require('../models');

const setReadMessagesStatus = async (room, receiver) => {
	let receiverData = await userModel
		.findByUsername(receiver)
		.select({ _id: 1 });

	await userChatsModel.updateMessageReadStatus(room, receiverData._id);
};

let chatHandler = {
	getParticularRoomMessages: async (roomID, sender, reciever) => {
		let messageData = await userChatsModel.findMessagesByRoomId(roomID);

		await setReadMessagesStatus(roomID, sender, reciever);
		return messageData;
	},

	saveNewMessage: async (roomID, sender, receiver, message) => {
		let senderData = await userModel
			.findByUsername(sender)
			.select({ _id: 1, firstName: 1, username: 1 });

		let receiverData = await userModel
			.findByUsername(receiver)
			.select({ _id: 1 });

		let savedMsg = await userChatsModel.save(
			senderData._id,
			receiverData._id,
			roomID,
			message
		);
		return { savedMsg, senderData };
	},

	getPrivateChats: async (userDetails) => {
		// let query = { sender: mongoose.Types.ObjectId(userDetails) };
		let aggregateArray = [
			{ $match: { sender: mongoose.Types.ObjectId(userDetails.id) } },
			{
				$project: {
					receiver: 1,
					text: 1,
					createdDate: 1,
					unreadMessages: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] },
				},
			},
			{
				$group: {
					_id: { id: '$receiver' },
					text: { $last: '$text' },
					receiver: { $last: '$receiver' },
					createdDate: { $last: '$createdDate' },
					unReadCount: { $sum: '$unreadMessages' },
				},
			},
			{ $sort: { createdDate: -1 } },
			{ $project: { _id: 0 } },
		];
		let populateOptions = {
			path: 'receiver',
			select: 'firstName lastName isActive',
		};

		let privateChats = await queries.aggregateDataWithPopulate(
			Schema.chats,
			aggregateArray,
			populateOptions
		);

		return { status: 200, data: { privateChats } };
	},
};

module.exports = chatHandler;
