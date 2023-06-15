interface NewFriendRequestPayload {
  email: string;
  invitationMessage?: string;
};

interface AcceptRejectRequestPayload {
  friendId: string;
  status: string;
};

export { NewFriendRequestPayload, AcceptRejectRequestPayload };