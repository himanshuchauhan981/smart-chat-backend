interface NewNotificationPayload {
  type: string;
  senderName?: string;
  receiverName?: string;
  receiver: string[];
};

export type {
  NewNotificationPayload,
};