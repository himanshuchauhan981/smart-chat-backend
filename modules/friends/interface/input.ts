interface NewFriendRequestPayload {
  email: string;
  invitationMessage?: string;
};

interface AcceptRejectRequestPayload {
  friendId: string;
  status: string;
  acceptedOn?: string;
  rejectedOn?: string;
};

interface AcceptRejectRequestUpdatePayload {
  status: string;
  acceptedOn?: Date;
  rejectedOn?: Date;
};

export {
  NewFriendRequestPayload,
  AcceptRejectRequestPayload,
  AcceptRejectRequestUpdatePayload,
};