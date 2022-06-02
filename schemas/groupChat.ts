import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class GroupChat extends DefaultField {

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