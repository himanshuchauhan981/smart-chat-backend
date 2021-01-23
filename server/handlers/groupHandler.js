const { groupDetailModel, userModel, groupChatModel } = require('../models');

let groupHandler = {
	createGroup: async (req, res) => {
		let groupData = req.body;
		let existingGroup = await groupDetailModel.findByGroupRoom(groupData.name);
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
			await groupDetailModel.create(groupObject);
			return { status: true, msg: 'New group created' };
		} else {
			return { status: false, msg: 'Group name already existed' };
		}
	},

	getUserGroups: async (username) => {
		let userDetails = await userModel.findByUsername(username);
		let groupList = await groupDetailModel
			.findParticularUserGroups(userDetails._id)
			.select({ room: 1 });
		return groupList;
	},

	getGroupMessages: async (groupName) => {
		let groupDetails = await groupDetailModel
			.findByGroupRoom(groupName)
			.select({ _id: 1 });
		let groupMessages = await groupChatModel.findByRoom(groupDetails._id);
		return groupMessages;
	},

	saveNewMessage: async (sender, roomID, message) => {
		let groupNameDetails = await groupDetailModel
			.findByGroupRoom(roomID)
			.select({ _id: 1, room: 1 });

		let senderDetails = await userModel
			.findByUsername(sender)
			.select({ firstName: 1 });
		let messageObject = {
			room: groupNameDetails._id,
			sender: senderDetails._id,
			text: message,
		};

		let savedMessage = await groupChatModel.create(messageObject);
		return { savedMessage, senderDetails, groupNameDetails };
	},
};

module.exports = groupHandler;
