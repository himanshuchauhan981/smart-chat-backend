import { ApiResponse } from "../../../interfaces/Api";

interface LoginData {
  token: string;
}

interface LoginResponse extends ApiResponse {
  data: LoginData;
}

interface SignUpResponse extends ApiResponse {}

export {
  LoginResponse,
  SignUpResponse
};