const bcryptjs = require('bcryptjs');
const moment = require('moment');
const mongoose = require('mongoose');

const { tokenUtil } = require('../utils');
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

	getUsersList: async (userDetails) => {
		try {
			let aggregateArray = [
				{ $match: { _id: { $ne: mongoose.Types.ObjectId(userDetails.id) } } },
				{
					$project: {
						name: {
							$concat: [
								{
									$concat: [
										{ $toUpper: { $substrCP: ['$firstName', 0, 1] } },
										{
											$substrCP: [
												'$firstName',
												1,
												{ $subtract: [{ $strLenCP: '$firstName' }, 1] },
											],
										},
									],
								},
								' ',
								{
									$concat: [
										{ $toUpper: { $substrCP: ['$lastName', 0, 1] } },
										{
											$substrCP: [
												'$lastName',
												1,
												{ $subtract: [{ $strLenCP: '$lastName' }, 1] },
											],
										},
									],
								},
							],
						},
						isActive: 1,
					},
				},
				{ $sort: { name: 1 } },
			];

			let userList = await queries.aggregateData(Schema.users, aggregateArray);

			return { status: 200, data: { userList } };
		} catch (err) {
			throw err;
		}
	},
};

module.exports = userHandler;
