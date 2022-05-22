const { userListHandler } = require('../handlers');

const userListController = {

	getAllFriendsList: async (req, res) => {
		const userDetails = req.user;
		const response = await userListHandler.getAllFriendsList(userDetails);

		res.status(response.status).send(response.data);
	},
};

module.exports = userListController;
