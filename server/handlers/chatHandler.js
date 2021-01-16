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
};

module.exports = chatHandler;
