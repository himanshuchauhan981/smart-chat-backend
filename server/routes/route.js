const express = require('express');

const { userController, groupController } = require('../controllers');

module.exports = () => {
	const router = express.Router();

	router.post('/signup', userController.signUp);

	router.post('/login', userController.login);

	router.get('/friendsList');

	// ---------------------------------------------------

	router.get('/user/details', userController.getUserDetails);

	router.get('/logout', userController.logoutExistingUser);

	router.get('/users', userController.getAllUsersName);

	router.post('/group', groupController.createGroup);

	return router;
};
