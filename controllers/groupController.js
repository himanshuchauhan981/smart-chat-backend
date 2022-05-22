const { groupHandler } = require('../handlers');

const groupController = {

	getUserGroups: async (req, res) => {
		try {

			const userDetails = req.user;
			const response = await groupHandler.getUserGroups(userDetails);

			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	createGroup: async (req, res) => {
		try {

			const groupDetails = req.body;
			const userDetails = req.user;

			const response = await groupHandler.createGroup(groupDetails, userDetails);

			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	addNewMembers: async (req, res) => {
		try {

			const groupMembers = req.body;
			const groupDetails = req.params;

			const response = await groupHandler.addNewMembers(
				groupMembers,
				groupDetails
			);

			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},
};

module.exports = groupController;
