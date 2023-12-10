import { ApiResponse } from "../../../interfaces/Api";

interface LoginData {
  token: string;
}

enum IsActive {
  offline = 'OFFLINE',
  online = 'ONLINE',
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

interface UpdateUserResponse extends ApiResponse {};

interface FriendsListResponse extends ApiResponse {
  friends: Friends[];
  count: number;
}

export {
  Friends,
  LoginResponse,
  SignUpResponse,
  FriendsListResponse,
  UpdateUserResponse,
};