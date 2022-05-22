const express = require('express');

const {
	userController,
	groupController,
	userListController,
	chatController,
} = require('../controllers');
const { validateAuth } = require('../middleware');

module.exports = () => {
	const router = express.Router();

	router.post('/signup', userController.signUp);

	router.post('/login', userController.login);

	router.get(
		'/friendsList',
		validateAuth.validateToken,
		userListController.getAllFriendsList
	);

	router.get(
		'/privateChats',
		validateAuth.validateToken,
		chatController.getPrivateChats
	);

	router.get(
		'/groups',
		validateAuth.validateToken,
		groupController.getUserGroups
	);

	router.post(
		'/group',
		validateAuth.validateToken,
		groupController.createGroup
	);

	router.post(
		'/group/:groupId/addMembers',
		validateAuth.validateToken,
		groupController.addNewMembers
	);

	router.get('/users', validateAuth.validateToken, userController.getUsersList);

	return router;
};
