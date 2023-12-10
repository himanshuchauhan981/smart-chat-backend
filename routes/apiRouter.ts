import { Router } from "express";

import { API_ROUTES } from "../constants";
import AuthController from "../modules/auth/AuthController";
import ChatController from "../modules/chats/ChatController";
import authValidation from "../middleware/jwtHandler.middleware";
import GroupChatController from "../modules/group-chats/GroupChatController";
import FriendsController from "../modules/friends/FriendsController";

class ApiRoutes {

  public router: Router;

  constructor() {
    this.router = Router();
  }

  public prepareRoutes(): Router {

    // Auth API
    this.router.post(API_ROUTES.SIGNUP, AuthController.signup);
    this.router.post(API_ROUTES.LOGIN, AuthController.login);

    // User API
    this.router.get(API_ROUTES.SPECIFIC_USER, authValidation, AuthController.specificUser);
    this.router.patch(API_ROUTES.SPECIFIC_USER, authValidation, AuthController.updateUser);

    // Friends Request API
    this.router.post(API_ROUTES.FRIEND_REQUEST, authValidation, FriendsController.newRequest);
    this.router.get(API_ROUTES.FRIEND_REQUEST, authValidation, FriendsController.requestList);
    this.router.post(API_ROUTES.ACCEPT_REJECT_FRIEND_REQUEST, authValidation, FriendsController.acceptRejectRequest);
    this.router.delete(API_ROUTES.REMOVE_FRIEND_REQUEST, authValidation, FriendsController.removeFriendRequest);
    this.router.get(API_ROUTES.FRIENDS, authValidation, FriendsController.friendsList);

    // Private Chat API
    this.router.get(API_ROUTES.PRIVATE_CHAT, authValidation, ChatController.privateChatList);
    this.router.get(API_ROUTES.SPECIFIC_CHAT, authValidation, ChatController.specificChatMessages);

    this.router.get(API_ROUTES.GROUP_CHAT, authValidation, GroupChatController.groupList);

    this.router.post(API_ROUTES.NEW_GROUP, authValidation, GroupChatController.create);

    this.router.post(API_ROUTES.NEW_GROUP_MEMBERS);

    this.router.get(API_ROUTES.USERS, authValidation, AuthController.findAllUsers);

    return this.router;
  }
}

export default ApiRoutes;