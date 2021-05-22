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
		let aggregateArray = [
			{
				$match: {
					$or: [
						{ sender: mongoose.Types.ObjectId(userDetails.id) },
						{ receiver: mongoose.Types.ObjectId(userDetails.id) },
					],
				},
			},
			{
				$project: {
					sender: 1,
					receiver: 1,
					text: 1,
					createdDate: 1,
					room: 1,
					unreadMessages: {
						$cond: [
							{
								$and: [
									{ $eq: ['$isRead', false] },
									{
										$eq: ['$receiver', mongoose.Types.ObjectId(userDetails.id)],
									},
								],
							},
							1,
							0,
						],
					},
				},
			},
			{
				$group: {
					_id: { id: '$room' },
					text: { $last: '$text' },
					receiver: { $last: '$receiver' },
					sender: { $last: '$sender' },
					unReadCount: { $sum: '$unreadMessages' },
				},
			},
			{ $sort: { createdDate: -1 } },
			{ $project: { _id: 0 } },
		];
		let populateOptions = [
			{
				path: 'receiver',
				select: 'firstName lastName isActive',
			},
			{
				path: 'sender',
				select: 'firstName lastName isActive',
			},
		];

		let privateChats = await queries.aggregateDataWithPopulate(
			Schema.chats,
			aggregateArray,
			populateOptions
		);

		for (let i = 0; i < privateChats.length; i++) {
			if (privateChats[i].receiver._id == userDetails.id) {
				let newReceiver = privateChats[i].receiver;
				privateChats[i].receiver = privateChats[i].sender;
				privateChats[i].sender = newReceiver;
			}
		}

		return { status: 200, data: { privateChats } };
	},
};

module.exports = chatHandler;
