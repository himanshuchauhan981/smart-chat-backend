import { ApiResponse } from "../../../interfaces/Api";

interface CreateGroupResponse extends ApiResponse {
  data: {
    message: string;
  }
}

interface Group {
  _id: string;
  name: string;
  image: null;
}

interface UserGroup {
  _id: string;
  group: Group;
}

interface GroupListResponse extends ApiResponse {
  data: {
    message: string;
    groupList: UserGroup[];
  }
}

export {
  CreateGroupResponse,
  GroupListResponse,
};