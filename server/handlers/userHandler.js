const bcryptjs = require('bcryptjs');

const { users, userOnlineStatus } = require('../schemas');
const { userModel } = require('../models');
const { factories } = require('../factories');
const { tokenUtil } = require('../utils');
const { makeUserOffline } = require('./userListHandler');

checkExistingUsers = async (username) => {
	let existingUserStatus = await users.find({ username: username });
	return existingUserStatus;
};

generateHashedPassword = async (password) => {
	let salt = bcryptjs.genSaltSync(10);
	let hashedPassword = bcryptjs.hashSync(password, salt);
	return hashedPassword;
};

checkHashedPassword = async (password, hashedPassword) => {
	let status = bcryptjs.compareSync(password, hashedPassword);
	return status;
};

saveNewUsers = async (values) => {
	let userObject = factories.createUserObject(values);
	let userData = await userModel.create(userObject);
	return userData;
};

saveLoginStatus = async (id) => {
	let loginData = factories.loginStatus(id, null);
	let loginStatus = new userOnlineStatus(loginData);
	await loginStatus.save();
};

let userHandler = {
	signUp: async (req, res) => {
		let values = req.body;

		let existingUser = await userModel.findByUsername(values.username);
		if (!existingUser) {
			values.password = await generateHashedPassword(values.password);
			let newUser = await saveNewUsers(values);
			saveLoginStatus(newUser._id);
			res.status(200).send({ signUpStatus: true });
		} else
			res.status(200).send({
				signUpStatus: false,
				msg: 'User already existed',
			});
	},

	login: async (values) => {
		let existingUser = await users.findOne({ username: values.username });

		if (existingUser != null) {
			if (checkHashedPassword(values.password, existingUser.password)) {
				let token = tokenUtil.createJWTToken(existingUser._id);
				await userOnlineStatus.updateOne(
					{ username: existingUser.username },
					{ $set: { isActive: 'online' } }
				);
				return { loginStatus: true, token: token };
			}
		}
		return { loginStatus: false, loginError: 'Incorrect Credentials' };
	},

	validateToken: async (req, res) => {
		let token = req.headers.authorization;
		let decodedToken = tokenUtil.decodeJWTToken(token);
		let usernameObject = await users
			.findById(decodedToken.id)
			.select({ username: 1, firstName: 1, lastName: 1 });
		return {
			status: 200,
			username: usernameObject.username,
			firstName: usernameObject.firstName,
			lastName: usernameObject.lastName,
		};
	},

	logoutExistingUser: async (req, res) => {
		let token = req.headers.authorization;

		let decodedToken = tokenUtil.decodeJWTToken(token);
		let usernameObject = await users
			.findById(decodedToken.id)
			.select({ username: 1 });

		await makeUserOffline(usernameObject.username);
		return { status: 200, msg: 'User Logout sucessfully' };
	},
};

module.exports = userHandler;
