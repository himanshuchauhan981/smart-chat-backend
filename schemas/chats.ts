import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class Chat extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public sender!: User;

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public receiver!: User;

	@prop({ required: true, type: String })
	public text!: string;

	@prop({ required: true, type: String })
	public room!: string;

	@prop({ type: Boolean, default: false })
	public isRead!: boolean;

	@prop({ type: Number, default: null })
	public isReadAt!: number;

	@prop({ type: Boolean, default: false })
	public fromDelete!: boolean;

	@prop({ type: Boolean, default: false })
	public toDelete!: boolean;
}

const ChatModel = getModelForClass(Chat);

export default ChatModel;