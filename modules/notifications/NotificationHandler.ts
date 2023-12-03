import NotificationModel, { NotificationType } from "../../schemas/notifications";
import { NewNotificationPayload } from "./interface/input";

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

      const newNotification = new NotificationModel({
        title,
        body,
        receiver: payload.receiver,
        sender,
        type: payload.type
      });

      const notification = await newNotification.save();

      return notification;
     }
    catch (error) {
      throw error;
    }
  }
};

export default NotificationHandler;