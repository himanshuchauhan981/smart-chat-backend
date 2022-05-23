const mongoose = require('mongoose');

const { queries } = require('../db');
const Schema = require('../schemas');
const RESPONSE_MESSAGES = require('../constants/response-messages');
const socketManager = require('../config/socketManager');

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

			const participantsIds = [...groupDetails.participants, userDetails.id ];

			socketManager.addGroupToGroupList(participantsIds, newGroup);

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
			for (const i = 0; i < groupMembers.length; i++) {

				const newGroupMember = {
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
			{ $unwind: { path: '$groupChat', preserveNullAndEmptyArrays: true } },
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
};

module.exports = groupHandler;
