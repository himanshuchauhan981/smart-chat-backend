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
		return this.userChat.find({ room: roomID });
	};
}

module.exports = new UserChat();
