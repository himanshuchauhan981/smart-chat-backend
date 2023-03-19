interface NewFriendRequestPayload {
  friendId: string;
};

interface AcceptRejectRequestPayload {
  friendId: string;
  status: string;
};

export { NewFriendRequestPayload, AcceptRejectRequestPayload };