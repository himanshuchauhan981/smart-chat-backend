import mongoose from "mongoose";
import { PropType, Severity, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

export enum ChatType {
	TEXT = 'TEXT',
	DOCUMENT = 'DOCUMENT',
}

@modelOptions({
	schemaOptions: { _id: false }
})
class File {
	@prop({
		type: String,
		required: true
	})
	url?: string;

	@prop({
		type: String,
		required: true,
	})
	name?: string;
};
@modelOptions({
	schemaOptions: { timestamps: true, versionKey: false, strict: false },
	options: { allowMixed: Severity.ALLOW }
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

	@prop({ required: false, type: String })
	public text: string;

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
	})
	public roomId: string;

	// @prop({ type: Boolean, default: false })
	// public isRead: boolean;

	// @prop({ type: Number, required: false })
	// public readAt: number;

	@prop({ type: [mongoose.Types.ObjectId], required: false })
	public deletedBy: string[];

	@prop({
		required: true,
		type: String,
		enum: ChatType,
	})
	type: string;

	@prop({
		required: false,
		type: () => [File],
		default: []
	}, PropType.ARRAY)
	file?: File[];
}

const ChatModel = getModelForClass(Chat);

export default ChatModel;
