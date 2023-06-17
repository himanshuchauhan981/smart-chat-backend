import mongoose from "mongoose";
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

import { User } from "./users";
import DefaultField from "./defaultFields";

export enum NotificationReadStatus {
	read = 'READ',
	unread = 'UNREAD',
}

export enum NotificationType {
  send_friend_request = 'SEND_FRIEND_REQUEST',
	accept_friend_request = 'ACCEPT_FRIEND_REQUEST',
};

@modelOptions({
	schemaOptions: { timestamps: true, versionKey: false }
})
export class Notification extends DefaultField {

	@prop({
		required: true,
		type: mongoose.Types.ObjectId,
		ref: () => User
	})
	public sender: User;

	@prop({ required: true, type: mongoose.Types.ObjectId })
	public receiver: string;

  @prop({ default: NotificationReadStatus.unread, enum: NotificationReadStatus, type: String })
	public status: string;

	@prop({ required: true, type: String, enum: NotificationType })
	public type: string;

  @prop({ required: true, type: String })
  public title: string;

  @prop({ required: true, type: String })
  public body: string;
}

const NotificationModel = getModelForClass(Notification);

export default NotificationModel;