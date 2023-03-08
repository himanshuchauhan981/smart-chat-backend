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
};

export default FriendHandler;