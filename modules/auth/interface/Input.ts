import { PaginationQuery } from "../../../interfaces/Api";

interface LoginInput {
  userName: string;
  password: string;
}

interface SignUpInput {
  fullName: string;
  userName: string;
  password: string;
  email: string;
}

interface FriendListQueries extends PaginationQuery {}

export { LoginInput, SignUpInput, FriendListQueries };