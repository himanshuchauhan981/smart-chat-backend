import mongoose from "mongoose";

class DefaultField {
  public _id: mongoose.Types.ObjectId;

  public createdAt: Date;

  public updatedAt: Date;
}

export default DefaultField;