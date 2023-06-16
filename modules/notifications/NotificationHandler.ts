import mongoose from "mongoose";

import { NotificationType } from "../../schemas/notifications";
import { NewNotificationPayload } from "./interface/input";
import Notification from '../../schemas/notifications';

class NotificationHandler {

  async create(payload: NewNotificationPayload, sender: string) {
    try {
      let title: string = '';
      let body: string = '';

      if(payload.type === NotificationType.send_friend_request) {
        title = 'Friend Request';
        body = `${payload.senderName} has sent you an friend request`;
      }
      else if(payload.type === NotificationType.accept_friend_request) {
        title = 'Friend Request';
        body = `${payload.receiverName} has accepted your friend request`;
      }

      await Notification.create({
        title,
        body,
        receiver: payload.receiver,
        sender,
        type: payload.type
      });
     }
    catch (error) {
      throw error;
    }
  }
};

export default NotificationHandler;