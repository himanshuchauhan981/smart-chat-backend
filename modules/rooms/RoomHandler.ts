import mongoose from "mongoose";
import RoomsModel from "../../schemas/rooms";
import { NewRoom } from "../socket/interface";

class RoomHandler {
  
  async create(payload: NewRoom) {
    return RoomsModel.create(payload);
  };

  async findByRoomId(roomId: string) {
    return RoomsModel.findById(roomId);
  };

  async updateLastMessage(roomId: string, messageId: string) {
    return RoomsModel.findByIdAndUpdate(
        roomId,
        { $set: { lastMessage: new mongoose.Types.ObjectId(messageId) } },
        { new: true }
      );
  }
};

export default RoomHandler;