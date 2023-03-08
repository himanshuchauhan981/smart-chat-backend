import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import DefaultField from "./defaultFields";

export enum UserChatStatus {
	online = 'online',
	offline = 'offline',
}

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class User extends DefaultField {

	@prop({ required: true, type: String })
	public fullName: string;

	@prop({ required: true, type: String })
	public userName: string;

	@prop({ required: true, type: String })
	public password: string;

	@prop({
		default: 'Hey there. I am using smart chat',
		type: String
	})
	public userStatus: string;

	@prop({ type: String })
	public image: string;

	@prop({
		enum: UserChatStatus,
		default: UserChatStatus.offline,
		type: String
	})
	public isActive: string;

	@prop({ type: Number })
	public lastLogin: number;

	@prop({ type: Number })
	public lastPasswordReset: number;
}

const UserModel = getModelForClass(User);

export default UserModel;
