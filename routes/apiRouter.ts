import { Router } from "express";

import { API_ROUTES } from "../constants";
import AuthController from "../modules/auth/AuthController";
import ChatController from "../modules/chats/ChatController";
import authValidation from "../middleware/jwtHandler.middleware";
import GroupChatController from "../modules/group-chats/GroupChatController";

class ApiRoutes {

  public router: Router;

  constructor() {
    this.router = Router();
  }

  public prepareRoutes(): Router {
    
    this.router.post(API_ROUTES.SIGNUP, AuthController.signup);

    this.router.post(API_ROUTES.LOGIN, AuthController.login);
    
    this.router.get(API_ROUTES.FRIENDS, authValidation, AuthController.friendsList);

    this.router.get(API_ROUTES.PRIVATE_CHAT, authValidation, ChatController.privateChatList);

    this.router.get(API_ROUTES.GROUP_CHAT, authValidation, GroupChatController.groupList);

    this.router.post(API_ROUTES.NEW_GROUP, authValidation, GroupChatController.create);

    this.router.post(API_ROUTES.NEW_GROUP_MEMBERS);

    this.router.get(API_ROUTES.USERS, authValidation, AuthController.findAllUsers);

    return this.router;
  }
}

export default ApiRoutes;

// const express = require('express');

// const {
// 	userController,
// 	groupController,
// 	userListController,
// 	chatController,
// } = require('../controllers');
// const { validateAuth } = require('../middleware');

// module.exports = () => {
// 	const router = express.Router();

// 	router.post('/signup', userController.signUp);

// 	router.post('/login', userController.login);

// 	router.get(
// 		'/friends',
// 		validateAuth.validateToken,
// 		userListController.getAllFriendsList,
// 	);

// 	router.get(
// 		'/chat/private',
// 		validateAuth.validateToken,
// 		chatController.getPrivateChats,
// 	);

// 	router.get(
// 		'/chat/group',
// 		validateAuth.validateToken,
// 		groupController.getUserGroups,
// 	);

// 	router.post(
// 		'/group',
// 		validateAuth.validateToken,
// 		groupController.createGroup,
// 	);

// 	router.post(
// 		'/group/:groupId/addMembers',
// 		validateAuth.validateToken,
// 		groupController.addNewMembers,
// 	);

// 	router.get('/users', validateAuth.validateToken, userController.getUsersList);

// 	return router;
// };
