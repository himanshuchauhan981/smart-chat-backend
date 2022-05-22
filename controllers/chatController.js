const { chatHandler } = require('../handlers');

const chatController = {

	getPrivateChats: async (req, res) => {

		const userDetails = req.user;
		const response = await chatHandler.getPrivateChats(userDetails);

		res.status(response.status).send(response.data);
	},
};

module.exports = chatController;
