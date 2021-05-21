const { chatHandler } = require('../handlers');

let chatController = {
	getParticularRoomMessages: async (roomID, sender, receiver) => {
		let messageData = await chatHandler.getParticularRoomMessages(
			roomID,
			sender,
			receiver._id
		);
		return messageData;
	},

	saveNewMessage: async (roomID, sender, receiver, message) => {
		let savedMessage = await chatHandler.saveNewMessage(
			roomID,
			sender,
			receiver,
			message
		);
		return savedMessage;
	},

	getPrivateChats: async (req, res) => {
		let userDetails = req.user;
		let response = await chatHandler.getPrivateChats(userDetails);
		res.status(response.status).send(response.data);
	},
};

module.exports = chatController;
