import RoomsModel from "../../schemas/rooms";
import { NewRoom } from "../socket/interface";

class RoomHandler {
  
  async create(payload: NewRoom) {
    await RoomsModel.create(payload);
  };

  async findByRoomId(roomId: string) {
    return RoomsModel.findOne({ roomId: roomId });
  };
};

export default RoomHandler;