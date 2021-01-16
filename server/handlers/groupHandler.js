const { users, groupChat } = require('../schemas');
const { groupDetails, userModel } = require('../models');

let groupHandler = {
	createGroup: async (req, res) => {
		let groupData = req.body;
		let existingGroup = await groupDetails.findByGroupRoom(groupData.name);
		if (existingGroup.length === 0) {
			let adminDetails = await userModel
				.findByUsername(groupData.admin)
				.select({ _id: 1 });
			let groupObject = {
				room: groupData.name,
				members: groupData.members.map(({ _id: memberId }) => ({
					memberId,
				})),
				admin: adminDetails._id,
				groupStatus: 'New Group',
				groupImage: 'No image',
			};
			await groupDetails.create(groupObject);
			return { status: true, msg: 'New group created' };
		} else {
			return { status: false, msg: 'Group name already existed' };
		}
	},

	getUserGroups: async (username) => {
		let userDetails = await userModel.findByUsername(username);
		let groupList = await groupDetails
			.findParticularUserGroups(userDetails._id)
			.select({ room: 1 });
		return groupList;
	},

	getGroupMessages: async (groupName) => {
		let groupMessages = await groupChat.find({ room: groupName });
		return groupMessages;
	},

	saveNewMessage: async (sender, roomID, message) => {
		let messageObject = new groupChat({
			room: roomID,
			sender: sender,
			text: message,
		});

		let savedMessage = await messageObject.save();
		return savedMessage;
	},
};

module.exports = groupHandler;
