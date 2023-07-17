import mongoose from 'mongoose';

import {STATUS_CODE, RESPONSE } from "../../constants";
import FriendsModel, { RequestStatus } from "../../schemas/friends";
import { AcceptRejectRequestPayload, AcceptRejectRequestUpdatePayload, NewFriendRequestPayload } from "./interface/input";
import { AcceptRejectRequestResponse } from './interface/response';
import UserModel from '../../schemas/users';
import CustomError from '../../exception/CustomError';
import NotificationHandler from '../notifications/NotificationHandler';
import { NotificationType } from '../../schemas/notifications';
import { User } from '../../interfaces/Api';
import { FriendsListResponse } from '../auth/interface/response';

class FriendHandler {
  notificationHandler: NotificationHandler;

  constructor() {
    this.notificationHandler = new NotificationHandler();
  }

  async newRequest(payload: NewFriendRequestPayload, user: User) {
    try {
      const existingUser = await UserModel.findOne(
        { email: payload.email, _id: { $ne: new mongoose.Types.ObjectId(user.id) } },
        { _id: 1 }
      );
  
      if(!existingUser) {
        throw new CustomError(RESPONSE.INVALID_EMAIL, STATUS_CODE.NOT_FOUND);
      }
  
      const requestCondition = {
        $and: [
          { isDeleted: false },
          {
            $or: [
              { requestedBy: new mongoose.Types.ObjectId(user.id) },
              { requestedBy: new mongoose.Types.ObjectId(existingUser._id) }
            ]
          },
          {
            $or: [
              { friendId: new mongoose.Types.ObjectId(user.id) },
              { friendId: new mongoose.Types.ObjectId(existingUser._id) }
            ]
          },
          { status: { $ne: RequestStatus.REJECTED } }
        ],
      };
  
      const existingFriendRequest = await FriendsModel.findOne(requestCondition, { _id: 1, requestedBy: 1, status: 1 });
  
      if(!existingFriendRequest) {
        const newFriendPayload = {
          friendId: existingUser._id,
          requestedBy: user.id,
          invitationMessage: payload.invitationMessage,
        };
    
        await FriendsModel.create(newFriendPayload);

        const notificationPayload = {
          type: NotificationType.send_friend_request,
          receiver: existingUser._id.toString(),
          senderName: user.fullName,
        };

        await this.notificationHandler.create(notificationPayload, user.id);
  
        return {
          message: RESPONSE.NEW_FRIEND_REQUEST,
          status: STATUS_CODE.SUCCESS
        };
      }

      if(existingFriendRequest.status === RequestStatus.ACCEPTED) {
        throw new CustomError(RESPONSE.ACCEPTED_FRIEND_REQUEST, STATUS_CODE.BAD_REQUEST);
      }
      else if(user.id !== existingFriendRequest.requestedBy.toString()) {
        throw new CustomError(RESPONSE.EXISTED_FRIEND_REQUEST, STATUS_CODE.BAD_REQUEST);
      }
  
      throw new CustomError(RESPONSE.EXISTED_FRIEND_REQUEST, STATUS_CODE.BAD_REQUEST);
    }
    catch (error) {
      throw error;
    }
  }

  async requestList(userId: string) {
    try {
      const conditions = {
        isDeleted: false,
        friendId: new mongoose.Types.ObjectId(userId),
        status: RequestStatus.REQUESTED,
      };
      const projections = { isDeleted: 0, updatedAt: 0, status: 0, friendId: 0 };
      const options = { sort: { createdAt: -1 } };

      const populateOptions = { path: 'requestedBy', select: '_id fullName' };
  
      const existingRequestList = await FriendsModel.find(conditions, projections, options).populate(populateOptions);
  
      return {
        status: STATUS_CODE.SUCCESS,
        requestList: existingRequestList,
      };
    }
    catch(err) {
      throw err;
    }
  };

  async acceptRejectRequest(payload: AcceptRejectRequestPayload, userId: string): Promise<AcceptRejectRequestResponse> {
    try {
      const uploadConditions = {
        friendId: new mongoose.Types.ObjectId(userId),
        requestedBy: new mongoose.Types.ObjectId(payload.friendId),
        status: RequestStatus.REQUESTED,
      };

      let toUpdate: AcceptRejectRequestUpdatePayload = {
        status: payload.status,
      };

      if(payload.status === RequestStatus.ACCEPTED) {
        toUpdate.acceptedOn = new Date();
      }
      else toUpdate.rejectedOn = new Date();

      const status = await FriendsModel.updateOne(
        uploadConditions,
        toUpdate,
      );

      if(!status.modifiedCount) {
        throw new CustomError(RESPONSE.INVALID_FRIEND_ID, STATUS_CODE.NOT_FOUND);
      }

      const friendDetails = await UserModel.findById(userId, { fullName: 1 } );

      const notificationPayload = {
        type: NotificationType.accept_friend_request,
        receiver: payload.friendId,
        receiverName: friendDetails?.fullName,
      };

      await this.notificationHandler.create(notificationPayload, userId);

      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE.SUCCESS,
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
        message: RESPONSE.SUCCESS,
        data: {}
      };
    }
    catch(err) {
      throw err;
    }
  }

  async friendsList(userId: string, query: any): Promise<FriendsListResponse> {
    try {
      const pageSize = parseInt(query.pageSize, 10);
      const pageIndex = pageSize * parseInt(query.pageIndex, 10);
      
      const matchConditions = {
        $or: [
          { friendId: new mongoose.Types.ObjectId(userId) },
          { requestedBy: new mongoose.Types.ObjectId(userId) },
        ],
        status: RequestStatus.ACCEPTED,
        isDeleted: false,
      };
  
      const aggregateArray: any[] = [
        {
          $match: matchConditions,
        },
        { $skip: pageIndex },
        { $limit: pageSize },
        {
          $project: {
            friendId: {
              $cond: {
                if: { $ne: ["$friendId", new mongoose.Types.ObjectId(userId)] },
                then: "$friendId",
                else: "$requestedBy",
              },
            },
          },
        },
        { $lookup: { from: "users", localField: "friendId", foreignField: "_id", as: "users" } },
        { $unwind: "$users" },
        { $project: { friendId: 1, friendName: "$users.fullName", isActive: "$users.isActive" } },
      ];

      const friends = await FriendsModel.aggregate(aggregateArray);

      const count = await FriendsModel.countDocuments(matchConditions);

      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE.SUCCESS,
        friends,
        count,
      };
    }
    catch(err) {
      throw err;
    }
  }
};

export default FriendHandler;