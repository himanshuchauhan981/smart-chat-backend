const mongoose = require('mongoose');

const { queries } = require('../db');
const Schema = require('../schemas');

const chatHandler = {

	getPrivateChats: async (userDetails) => {
		const aggregateArray = [
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
					createdDate: { $last: '$createdDate' },
				},
			},
			{ $sort: { createdDate: -1 } },
			{ $project: { _id: 0 } },
		];
		const populateOptions = [
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

		for (const i = 0; i < privateChats.length; i++) {
			if (privateChats[i].receiver._id == userDetails.id) {
				const newReceiver = privateChats[i].receiver;
				privateChats[i].receiver = privateChats[i].sender;
				privateChats[i].sender = newReceiver;
			}
		}

		return { status: 200, data: { privateChats } };
	},
};

module.exports = chatHandler;
