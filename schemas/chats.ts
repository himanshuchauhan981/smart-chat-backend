import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

@modelOptions({
	schemaOptions: { timestamps: true, versionKey: false }
})
export class Chat extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public sender: User;

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public receiver: User;

	@prop({ required: true, type: String })
	public text: string;

	@prop({ required: true, type: String })
	public room: string;

	// @prop({ type: Boolean, default: false })
	// public isRead: boolean;

	// @prop({ type: Number, required: false })
	// public readAt: number;

	@prop({ type: [mongoose.Types.ObjectId], required: false })
	public deletedBy: string[];
}

const ChatModel = getModelForClass(Chat);

export default ChatModel;
