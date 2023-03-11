import mongoose from 'mongoose';

import response from "../../constants/response";
import statusCode from "../../constants/statusCode";
import FriendsModel from "../../schemas/friends";
import { NewFriendRequestPayload } from "./interface/input";

class FriendHandler {

  async newRequest(payload: NewFriendRequestPayload, userId: string) {
    const requestCondition = {
      isDeleted: false,
      requestedBy: new mongoose.Types.ObjectId(userId),
      friendId: new mongoose.Types.ObjectId(payload.friendId),
      status: 'REQUESTED',
    };

    const existingFriendRequest = await FriendsModel.findOne(requestCondition, { _id: 1 });

    if(!existingFriendRequest) {
      const newFriendPayload = {
        friendId: payload.friendId,
        requestedBy: userId,
      };
  
      await FriendsModel.create(newFriendPayload);
    }

    return {
			status: statusCode.SUCCESS,
			data: { message: response.NEW_FRIEND_REQUEST },
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

      const populate = 
        { path: 'requestedBy', select: '_id fullName' }
      ;
  
      const existingRequestList = await FriendsModel.find(conditions, projections, options).populate(populate);
  
      return {
        status: statusCode.SUCCESS,
        data: { requestList: existingRequestList },
      };
    }
    catch(err) {
      throw err;
    }
  };
};

export default FriendHandler;