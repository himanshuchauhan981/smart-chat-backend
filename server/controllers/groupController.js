const { groupHandler } = require('../handlers');

let groupController = {
	getUserGroups: async (req, res) => {
		let userDetails = req.user;
		let response = await groupHandler.getUserGroups(userDetails);
		res.status(response.status).send(response.data);
	},

	createGroup: async (req, res) => {
		try {
			let groupDetails = req.body;
			let userDetails = req.user;
			let response = await groupHandler.createGroup(groupDetails, userDetails);
			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	addNewMembers: async (req, res) => {
		try {
			let groupMembers = req.body;
			let groupDetails = req.params;

			let response = await groupHandler.addNewMembers(
				groupMembers,
				groupDetails
			);
			res.status(response.status).send(response.data);
		} catch (err) {
			throw err;
		}
	},

	// ---------------------------------------------------------

	getGroupMessages: async (groupName) => {
		let response = await groupHandler.getGroupMessages(groupName);
		return response;
	},

	saveNewMessage: async (sender, roomID, message) => {
		let response = await groupHandler.saveNewMessage(sender, roomID, message);
		return response;
	},
};

module.exports = groupController;
