const { userHandler } = require('../handlers');

const userController = {

	signUp: async (req, res) => {
		const userData = req.body;
		const response = await userHandler.signUp(userData);

		res.status(response.status).send(response.data);
	},

	login: async (req, res) => {
		const userData = req.body;
		const response = await userHandler.login(userData);

		res.status(response.status).send(response.data);
	},

	getUsersList: async (req, res) => {
		const userDetails = req.user;
		const response = await userHandler.getUsersList(userDetails);

		res.status(response.status).send(response.data);
	},
};

module.exports = userController;
