import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

enum status {
	online = 'online',
	offline = 'offline',
}

@modelOptions({
	schemaOptions: { timestamps: true }
})
export class User {

	@prop({ required: true, type: String })
	public firstName!: string;

	@prop({ required: true, type: String })
	public lastName!: string;

	@prop({ unique: true, required: true, type: String })
	public username!: string;

	@prop({ required: true, type: String })
	public password!: string;

	@prop({
		default: 'Hey there. I am using smart chat',
		type: String
	})
	public userStatus!: string;

	@prop({ type: String })
	public image!: string;

	@prop({
		enum: status,
		default: status.offline,
		type: String
	})
	public isActive!: string;

	@prop({ type: Number })
	public lastLogin!: number;

	@prop({ type: Number })
	public lastPasswordReset!: number;
}

const UserModel = getModelForClass(User);

export default UserModel;
