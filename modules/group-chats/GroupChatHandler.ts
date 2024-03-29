import mongoose, { QueryWithHelpers } from "mongoose";

import response from "../../constants/response";
import statusCode from "../../constants/statusCode";
import GroupChatModel from "../../schemas/groupChat";
import GroupDetailsModel, { GroupDetails } from "../../schemas/groupDetails";
import GroupMemberModel from "../../schemas/groupMembers";
import SocketManager from "../../server/SocketManager";
import { SendMessagePayload } from "../socket/interface";
import { NewGroupPayload } from "./interface/input";
import { CreateGroupResponse, GroupListResponse } from "./interface/response";

class GroupChatHandler {

  async createGroup(payload: NewGroupPayload, userId: string): Promise<CreateGroupResponse> {

		const newGroupPayload = {
			name: payload.name,
			admin: userId,
		};

		const newGroup = await GroupDetailsModel.create(newGroupPayload);

		const groupParticipantsPayload: any = payload.participants.map(item => ({
			userId: item,
			groupId: newGroup._id,
		}));

		groupParticipantsPayload.push({ userId, groupId: newGroup._id });

		await GroupMemberModel.insertMany(groupParticipantsPayload);

		SocketManager.addGroupToGroupList(groupParticipantsPayload, newGroup);

		return {
			status: statusCode.success,
			data: { message: response.success },
		};
  }

  async userGroupList(userId: string): Promise<GroupListResponse> {
    const aggregateArray = [
			{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
			{
				$lookup: {
					from: 'groupdetails',
					localField: 'groupId',
					foreignField: '_id',
					as: 'group',
				},
			},
			{ $unwind: '$group' },
			{
				$lookup: {
					from: 'groupchats',
					localField: 'groupId',
					foreignField: 'room',
					as: 'groupChat',
				},
			},
			{ $addFields: { groupChat: { $slice: ['$groupChat', -1] } } },
			{ $unwind: { path: '$groupChat', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					'group._id': 1,
					'group.image': 1,
					'group.name': 1,
					_id: 1,
					'groupChat.text': 1,
					'groupChat.createdDate': 1,
				},
			},
		];

    const groupList = await GroupMemberModel.aggregate(aggregateArray);

    return { status: statusCode.success, data: { groupList, message: response.success } };
  }

	findGroupById(id: string): QueryWithHelpers<GroupDetails | null, GroupDetails> {
		return GroupDetailsModel.findById(id);
	}

	groupChatList(id: string) {
		const populateOptions = [{ path: 'sender', select: 'firstName lastName' }];
		const projections = {
			text: 1,
			createdAt: 1,
			sender: 1,
		};

		return GroupChatModel.find({ room: id }, projections).populate(populateOptions);
	}

	async createMessage(messagePayload: SendMessagePayload) {

		const populateOptions = [{ path: 'sender', select: 'firstName lastName' }];

		const newMessage = await GroupChatModel.create(messagePayload);

		return newMessage.populate(populateOptions);
	}

	countDocuments(room: string, senderId: string, isRead: boolean) {
		return GroupChatModel.countDocuments({ room, isRead, sender: new mongoose.Types.ObjectId(senderId) });
	}
};

export default GroupChatHandler;