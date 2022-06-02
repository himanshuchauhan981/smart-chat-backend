import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import { GroupDetails } from "./groupDetails";
import DefaultField from "./defaultFields";

enum status {
	active = 'active',
	deleted = 'deleted',
};

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class GroupMember extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public userId!: User;

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => GroupDetails
	})
	public groupId!: GroupDetails;

	@prop({
		enum: status,
		default: status.active,
		type: String
	})
	public status!: string;
}

const GroupMemberModel = getModelForClass(GroupMember);

export default GroupMemberModel;
