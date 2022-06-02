import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class GroupDetails extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public admin!: User;

	@prop({ required: true, type: String })
	public name!: string;

	@prop({ default: null, type: String })
	public status!: string;
	
	@prop({ default: null, type: String })
	public image!: string;
}

const GroupDetailsModel = getModelForClass(GroupDetails);

export default GroupDetailsModel;