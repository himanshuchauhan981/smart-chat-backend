import { Router } from "express";

import { API_ROUTES } from "../constants";
import AuthController from "../modules/auth/AuthController";

class ApiRoutes {

  public router: Router;

  constructor() {
    this.router = Router();
  }

  public prepareRoutes(): Router {
    
    this.router.post(API_ROUTES.SIGNUP, AuthController.signup);

    this.router.post(API_ROUTES.LOGIN, AuthController.login);
    
    this.router.get(API_ROUTES.FRIENDS);

    this.router.get(API_ROUTES.PRIVATE_CHAT);

    this.router.post(API_ROUTES.NEW_GROUP);

    this.router.post(API_ROUTES.NEW_GROUP_MEMBERS);

    this.router.get(API_ROUTES.USERS);

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
