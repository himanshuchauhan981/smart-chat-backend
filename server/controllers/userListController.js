const { userListHandler } = require('../handlers');

let userListController = {
	makeUserOnline: async (userId) => {
		await userListHandler.makeUserOnline(userId);
	},

	makeUserOffline: async (userId) => {
		await userListHandler.makeUserOffline(userId);
	},

	showAllActiveUsers: async (username) => {
		if (username) {
			let activeUserData = await userListHandler.showAllActiveUsers(username);
			return activeUserData;
		}
	},

	getAllFriendsList: async (req, res) => {
		let userDetails = req.user;
		let response = await userListHandler.getAllFriendsList(userDetails);
		res.status(response.status).send(response.data);
	},
};

module.exports = userListController;
