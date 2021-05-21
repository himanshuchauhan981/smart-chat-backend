const { userHandler, userListHandler } = require('../handlers');

let userController = {
	signUp: async (req, res) => {
		try {
			let userData = req.body;
			let response = await userHandler.signUp(userData);
			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	login: async (req, res) => {
		try {
			let userData = req.body;
			let response = await userHandler.login(userData);
			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	logoutExistingUser: async (req, res) => {
		let response = await userHandler.logoutExistingUser(req, res);
		res.status(200).send(response);
	},

	getAllUsersName: async (req, res) => {
		let response = await userListHandler.showAllUserNames(req, res);
		res.status(200).send(response);
	},
};

module.exports = userController;
