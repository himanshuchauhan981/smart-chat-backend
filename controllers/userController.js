const { userHandler } = require('../handlers');

const userController = {

	signUp: async (req, res) => {
		try {
			const userData = req.body;
			const response = await userHandler.signUp(userData);

			res.status(response.status).send(response.data);
		} catch (err) {

			throw err;
		}
	},

	login: async (req, res) => {
		try {
			const userData = req.body;
			const response = await userHandler.login(userData);

			res.status(response.status).send(response.data);
		} catch (err) {

			throw err;
		}
	},

	getUsersList: async (req, res) => {
		try {

			const userDetails = req.user;
			const response = await userHandler.getUsersList(userDetails);

			res.status(response.status).send(response.data);
		} catch (err) {

			throw err;
		}
	},
};

module.exports = userController;
