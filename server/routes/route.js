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

	// ---------------------------------------------------

	router.get('/logout', userController.logoutExistingUser);

	router.get('/users', userController.getAllUsersName);

	router.post('/group', groupController.createGroup);

	return router;
};
