import mongoose from 'mongoose';

import RESPONSE_MESSAGES from "../../constants/response";
import STATUS_CODE from "../../constants/statusCode";
import FriendsModel, { RequestStatus } from "../../schemas/friends";
import { AcceptRejectRequestPayload, NewFriendRequestPayload } from "./interface/input";
import { AcceptRejectRequestResponse } from './interface/response';
import UserModel from '../../schemas/users';
import CustomError from '../../exception/CustomError';


class FriendHandler {

  async newRequest(payload: NewFriendRequestPayload, userId: string) {
    const existingUser = await UserModel.findOne(
      { email: payload.email, _id: { $ne: new mongoose.Types.ObjectId(userId) } },
      { _id: 1 }
    );

    if(!existingUser) {
      throw new CustomError(RESPONSE_MESSAGES.INVALID_EMAIL, STATUS_CODE.NOT_FOUND);
    }

    const requestCondition = {
      isDeleted: false,
      requestedBy: new mongoose.Types.ObjectId(userId),
      friendId: new mongoose.Types.ObjectId(existingUser?._id),
    };

    const existingFriendRequest = await FriendsModel.findOne(requestCondition, { _id: 1 });

    if(!existingFriendRequest) {
      const newFriendPayload = {
        friendId: existingUser._id,
        requestedBy: userId,
        invitationMessage: payload.invitationMessage,
      };
  
      await FriendsModel.create(newFriendPayload);

      return {
        status: STATUS_CODE.SUCCESS,
        data: { message: RESPONSE_MESSAGES.NEW_FRIEND_REQUEST, status: STATUS_CODE.SUCCESS },
      };
    }

    return {
			status: STATUS_CODE.BAD_REQUEST,
			data: { message: RESPONSE_MESSAGES.EXISTED_FRIEND_REQUEST, status: STATUS_CODE.BAD_REQUEST },
		};
  }

  async requestList(userId: string) {
    try {
      const conditions = {
        isDeleted: false,
        friendId: new mongoose.Types.ObjectId(userId),
        status: 'REQUESTED',
      };
      const projections = { isDeleted: 0, updatedAt: 0, status: 0, friendId: 0 };
      const options = { sort: { createdAt: -1 } };

      const populate = { path: 'requestedBy', select: '_id fullName' };
  
      const existingRequestList = await FriendsModel.find(conditions, projections, options).populate(populate);
  
      return {
        status: STATUS_CODE.SUCCESS,
        data: { requestList: existingRequestList },
      };
    }
    catch(err) {
      throw err;
    }
  };

  async acceptRejectRequest(payload: AcceptRejectRequestPayload, userId: string): Promise<AcceptRejectRequestResponse> {
    try {
      const conditions = {
        requestedBy: payload.friendId,
        friendId: userId,
      };

      const toUpdate = {
        status: payload.status,
      };

      await FriendsModel.updateOne(conditions, toUpdate);

      if(payload.status === RequestStatus.ACCEPTED) {
        await FriendsModel.updateOne(
          { requestedBy: new mongoose.Types.ObjectId(userId), friendId: new mongoose.Types.ObjectId(payload.friendId) },
          { status: payload.status }
        );
      }

      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: {}
      };
    }
    catch(err) {
      throw err;
    }
  };

  async removeFriendRequest(friendId: string, requestedBy: string) {
    try {
      const conditions = { friendId, requestedBy };
      const toUpdate = { isDeleted: true };

      await FriendsModel.updateOne(conditions, toUpdate);

      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: {}
      };
    }
    catch(err) {
      throw err;
    }
  }
};

export default FriendHandler;