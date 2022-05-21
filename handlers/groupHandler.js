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
		const aggregateArray = [
			{ $match: { userId: mongoose.Types.ObjectId(userDetails.id) } },
			{
        $lookup: {
					from: 'groupdetails',
					let: { 'groupId': '$_id' },
					pipeline: [
							{ $match: { $expr: ['$$groupId', '$groupId'] } }
					],
					as: 'group'
        }
			},
			{ $unwind: '$group' },
			{
        $lookup: {
					from: 'groupchats',
					localField: 'groupId',
					foreignField: 'room',
					as: 'groupChat'
				}
			},
			{ $addFields: { groupChat: { $slice: ['$groupChat', -1] } } },
			{ $unwind: '$groupChat' },
			{
				$project: {
					'group._id': 1,
					'group.image':1,
					'group.name': 1,
					'_id': 1,
					'groupChat.text': 1,
					'groupChat.createdDate': 1,
				}
			}
		];

		const options = {};

		const userGroups = await queries.aggregateData(
			Schema.groupMembers,
			aggregateArray,
			options
		);

		return {
			status: RESPONSE_MESSAGES.ADD_NEW_MEMBERS.STATUS_CODE,
			data: { groupList: userGroups }
		};
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
