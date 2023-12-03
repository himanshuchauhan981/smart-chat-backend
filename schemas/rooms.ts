import mongoose from "mongoose";
import { PropType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

export enum RoomType {
	PRIVATE = 'PRIVATE',
	GROUP = 'GROUP',
}

@modelOptions({
	schemaOptions: { timestamps: true, versionKey: false }
})
export class Rooms extends DefaultField {

	@prop({
		enum: RoomType,
		type: String,
		required: true,
	})
	public type: string;

  @prop({
		type: [mongoose.Schema.Types.ObjectId],
		ref: User,
		required: true,
		index: true,
	}, PropType.ARRAY)
	public members!: mongoose.Schema.Types.ObjectId[];

	@prop({
		required: false,
		type: mongoose.Types.ObjectId,
		ref: 'Chat',
	})
	public lastMessage: string;
}

const RoomsModel = getModelForClass(Rooms);

export default RoomsModel;
