const { groupChat } = require('../schemas');

class GroupChat {
	constructor() {
		this.groupChatModel = groupChat;
	}

	findByRoom(room) {
		return this.groupChatModel.aggregate([
			{ $match: { room: room } },
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
	}

	create(messageData) {
		let messageObject = new this.groupChatModel(messageData);
		return messageObject.save();
	}
}

module.exports = new GroupChat();
