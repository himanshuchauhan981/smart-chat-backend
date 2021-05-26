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

	getUsersList: async (req, res) => {
		let userDetails = req.user;
		let response = await userHandler.getUsersList(userDetails);
		res.status(200).send(response);
	},
};

module.exports = userController;
