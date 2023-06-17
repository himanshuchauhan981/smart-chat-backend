import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

export enum RequestStatus {
	REQUESTED = 'REQUESTED',
	ACCEPTED = 'ACCEPTED',
	REJECTED = "REJECTED"
}

@modelOptions({
	schemaOptions: { timestamps: true, versionKey: false }
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
		required: false,
		type: String,
	})
	public invitationMessage: string;

  @prop({
		enum: RequestStatus,
		default: RequestStatus.REQUESTED,
		type: String
	})
	public status: string;

  @prop({
		default: false,
		type: Boolean
	})
	public isDeleted: boolean;

	@prop({
		required: false,
		type: Date,
	})
	public acceptedOn: string;

	@prop({
		required: false,
		type: Date,
	})
	public rejectedOn: string;
}

const FriendsModel = getModelForClass(Friend);

export default FriendsModel;
