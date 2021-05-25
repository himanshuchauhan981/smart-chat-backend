const { groupDetailModel, userModel, groupChatModel } = require('../models');
const { queries } = require('../db');
const Schema = require('../schemas');
const RESPONSE_MESSAGES = require('../config/response-messages');

let groupHandler = {
	createGroup: async (groupDetails, userDetails) => {
		try {
			// groupDetails.admin = userDetails.id;
			let newGroup = await queries.create(Schema.groupDetails, groupDetails);

			let groupMemberDetails = {
				userId: userDetails.id,
				isAdmin: true,
				groupId: newGroup._id,
			};

			let newGroupDetails = await queries.create(
				Schema.groupMembers,
				groupMemberDetails
			);
			return {
				status: RESPONSE_MESSAGES.CREATE_GROUP.STATUS_CODE,
				data: {
					msg: RESPONSE_MESSAGES.CREATE_GROUP.MSG,
					groupId: newGroupDetails._id,
				},
			};
		} catch (err) {
			throw err;
		}
	},

	addNewMembers: async (groupMembers, groupDetails) => {
		try {
			for (let i = 0; i < groupMembers.length; i++) {
				console.log('hello');
				let newGroupMember = {
					userId: groupMembers[i],
					isAdmin: false,
					groupId: groupDetails.groupId,
				};

				await queries.create(Schema.groupMembers, newGroupMember);
			}
			return {
				status: RESPONSE_MESSAGES.ADD_NEW_MEMBERS.STATUS_CODE,
				data: { msg: RESPONSE_MESSAGES.ADD_NEW_MEMBERS.MSG },
			};
		} catch (err) {
			throw err;
		}
	},

	getUserGroups: async (userDetails) => {
		let query = {};
		let projections = {};
		let options = {};
		let userGroups = await queries.getData(
			Schema.groupDetails,
			query,
			projections,
			options
		);

		return { status: 200, data: { groupList: userGroups } };
		// let userDetails = await userModel.findByUsername(username);
		// let groupList = await groupDetailModel
		// 	.findParticularUserGroups(userDetails._id)
		// 	.select({ room: 1 });
		// return groupList;
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
