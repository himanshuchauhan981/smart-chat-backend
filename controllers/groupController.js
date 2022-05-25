const { groupHandler } = require('../handlers');

const groupController = {

	getUserGroups: async (req, res) => {
		const userDetails = req.user;
		const response = await groupHandler.getUserGroups(userDetails);

		res.status(response.status).send(response.data);
	},

	createGroup: async (req, res) => {
		const groupDetails = req.body;
		const userDetails = req.user;

		const response = await groupHandler.createGroup(groupDetails, userDetails);

		res.status(response.status).send(response.data);
	},

	addNewMembers: async (req, res) => {
		const groupMembers = req.body;
		const groupDetails = req.params;

		const response = await groupHandler.addNewMembers(
			groupMembers,
			groupDetails,
		);

		res.status(response.status).send(response.data);
	},
};

module.exports = groupController;
