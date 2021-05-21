const bcryptjs = require('bcryptjs');
const moment = require('moment');

const { users } = require('../schemas');
const { tokenUtil } = require('../utils');
const { makeUserOffline } = require('./userListHandler');
const { queries } = require('../db');
const Schema = require('../schemas');
const APP_DEFAULTS = require('../config/app-defaults');
const RESPONSE_MESSAGES = require('../config/response-messages');

const generateHashedPassword = async (password) => {
	let salt = bcryptjs.genSaltSync(10);
	let hashedPassword = bcryptjs.hashSync(password, salt);
	return hashedPassword;
};

const checkHashedPassword = async (password, hashedPassword) => {
	let status = bcryptjs.compareSync(password, hashedPassword);
	return status;
};

let userHandler = {
	signUp: async (userData) => {
		try {
			let query = { username: userData.username };
			let projections = {};
			let options = { lean: true };

			let existingUser = await queries.findOne(
				Schema.users,
				query,
				projections,
				options
			);

			if (existingUser) {
				return {
					status: RESPONSE_MESSAGES.EXISTING_USER.STATUS_CODE,
					data: { msg: RESPONSE_MESSAGES.EXISTING_USER.MSG },
				};
			} else {
				userData.password = await generateHashedPassword(userData.password);
				await queries.create(Schema.users, userData);
				return { status: 200, data: {} };
			}
		} catch (err) {
			throw err;
		}
	},

	login: async (userData) => {
		try {
			let query = { username: userData.username };
			let projections = { password: 1, username: 1 };
			let options = { lean: true };

			let existingUser = await queries.findOne(
				Schema.users,
				query,
				projections,
				options
			);

			if (existingUser) {
				let passwordStatus = await checkHashedPassword(
					userData.password,
					existingUser.password
				);
				if (passwordStatus) {
					let token = tokenUtil.createJWTToken(existingUser._id);

					let conditions = { username: existingUser._id };
					let toUpdate = {
						$set: {
							isActive: APP_DEFAULTS.ACTIVE_STATUS.ONLINE,
							lastLogin: moment().valueOf(),
						},
					};
					options = {};

					await queries.findAndUpdate(Schema.users, conditions, toUpdate);

					return { status: 200, data: { token: token } };
				} else
					return {
						status: RESPONSE_MESSAGES.INVALID_CREDENTIALS.STATUS_CODE,
						data: { msg: RESPONSE_MESSAGES.INVALID_CREDENTIALS.MSG },
					};
			} else {
				return {
					status: RESPONSE_MESSAGES.NO_USER_FOUND.STATUS_CODE,
					data: { msg: RESPONSE_MESSAGES.NO_USER_FOUND.MSG },
				};
			}
		} catch (err) {
			throw err;
		}
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
