const { userChat } = require('../schemas');
const mongoose = require('mongoose');

class UserChat {
	constructor() {
		this.userChat = userChat;
	}

	save = (senderId, receiverId, roomId, message) => {
		let messageObject = new this.userChat({
			sender: senderId,
			receiver: receiverId,
			room: roomId,
			text: message,
		});
		return messageObject.save();
	};

	updateMessageReadStatus = (room, receiverId) => {
		return this.userChat.updateMany(
			{
				$and: [
					{ room: room },
					{ receiver: mongoose.Types.ObjectId(receiverId) },
					{ isRead: false },
				],
			},
			{
				$set: {
					isRead: true,
				},
			}
		);
	};

	findMessagesByRoomId = (roomID) => {
		return this.userChat.aggregate([
			{
				$match: { room: roomID },
			},
			{
				$lookup: {
					from: 'users',
					localField: 'sender',
					foreignField: '_id',
					as: 'userInfo',
				},
			},
			{ $unwind: '$userInfo' },
			{
				$project: {
					text: 1,
					sendDate: 1,
					'userInfo.firstName': 1,
					'userInfo.username': 1,
				},
			},
		]);
	};
}

module.exports = new UserChat();
