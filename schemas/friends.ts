import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

export enum RequestStatus {
	requested = 'REQUESTED',
	accepted = 'ACCEPTED',
}

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class Friend extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public friendId: User;

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public requestedBy: User;

  @prop({
		enum: RequestStatus,
		default: RequestStatus.requested,
		type: String
	})
	public status: string;

  @prop({
		default: false,
		type: Boolean
	})
	public isDeleted: boolean;
}

const FriendsModel = getModelForClass(Friend);

export default FriendsModel;
