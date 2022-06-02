import { ApiResponse } from "../../../interfaces/Api";

interface LoginData {
  token: string;
}

enum IsActive {
  offline = 'offline',
  online = 'online',
}

interface Friends {
  _id: string;
  firstName: string;
  lastName: string;
  userStatus: string;
  isActive: IsActive;
}

interface LoginResponse extends ApiResponse {
  data: LoginData;
}

interface SignUpResponse extends ApiResponse {}

interface FriendsListResponse extends ApiResponse {
  data: {
    friendsList: Friends[]
  };
}

export {
  Friends,
  LoginResponse,
  SignUpResponse,
  FriendsListResponse
};