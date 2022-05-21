const mongoose = require('mongoose');

const { groupDetailModel, userModel, groupChatModel } = require('../models');
const { queries } = require('../db');
const Schema = require('../schemas');
const RESPONSE_MESSAGES = require('../config/response-messages');

let groupHandler = {
	createGroup: async (groupDetails, userDetails) => {
		try {
			const newGroupPayload = {
				name: groupDetails.name,
				admin: userDetails.id,
			};
			const newGroup = await queries.create(Schema.groupDetails, newGroupPayload);

			groupDetails.participants.forEach(async (item) =>{
				const groupMembersPayload = {
					userId: item,
					groupId: newGroup._id,
				};

				await queries.create(Schema.groupMembers, groupMembersPayload);
			});

			await queries.create(Schema.groupMembers, {
				userId: userDetails.id,
				groupId: newGroup._id,
			});

			return {
				status: RESPONSE_MESSAGES.CREATE_GROUP.STATUS_CODE,
				data: {
					msg: RESPONSE_MESSAGES.CREATE_GROUP.MSG,
				},
			};
		} catch (err) {
			throw err;
		}
	},

	addNewMembers: async (groupMembers, groupDetails) => {
		try {
			for (let i = 0; i < groupMembers.length; i++) {
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
		let aggregateArray = [
			{ $match: { userId: mongoose.Types.ObjectId(userDetails.id) } },
			{ $project: { groupId: 1 } },
		];

		let populateOptions = { path: 'groupId', select: 'name image' };

		let userGroups = await queries.aggregateDataWithPopulate(
			Schema.groupMembers,
			aggregateArray,
			populateOptions
		);

		return { status: 200, data: { groupList: userGroups } };
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
