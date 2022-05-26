import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class GroupChat {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public sender!: User;

	@prop({ required: true, type: String })
	public text!: string;

	@prop({ required: true, type: String })
	public room!: string;
}

const GroupChatModel = getModelForClass(GroupChat);

export default GroupChatModel;