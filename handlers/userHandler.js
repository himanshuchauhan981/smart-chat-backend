const bcryptjs = require('bcryptjs');
const moment = require('moment');
const mongoose = require('mongoose');

const { tokenUtil } = require('../utils');
const { queries } = require('../db');
const Schema = require('../schemas');
const { APP_DEFAULTS, RESPONSE_MESSAGES } = require('../constants');

const generateHashedPassword = async (password) => {
	const salt = bcryptjs.genSaltSync(10);
	const hashedPassword = bcryptjs.hashSync(password, salt);
	return hashedPassword;
};

const checkHashedPassword = async (password, hashedPassword) => {
	const status = bcryptjs.compareSync(password, hashedPassword);
	return status;
};

const userHandler = {
	signUp: async (userData) => {
		const query = { username: userData.username };
		const projections = {};
		const options = { lean: true };

		const existingUser = await queries.findOne(
			Schema.users,
			query,
			projections,
			options,
		);

		if (existingUser) {
			return {
				status: RESPONSE_MESSAGES.EXISTING_USER.STATUS_CODE,
				data: { msg: RESPONSE_MESSAGES.EXISTING_USER.MSG },
			};
		}
		const password = await generateHashedPassword(userData.password);

		const updatedUserData = {
			...userData,
			password,
		};

		await queries.create(Schema.users, updatedUserData);
		return { status: 200, data: {} };
	},

	login: async (userData) => {
		const query = { username: userData.username };
		const projections = { password: 1, username: 1 };
		let options = { lean: true };

		const existingUser = await queries.findOne(
			Schema.users,
			query,
			projections,
			options,
		);

		if (existingUser) {
			const passwordStatus = await checkHashedPassword(
				userData.password,
				existingUser.password,
			);
			if (passwordStatus) {
				const token = tokenUtil.createJWTToken(existingUser._id);

				const conditions = { username: existingUser._id };
				const toUpdate = {
					$set: {
						isActive: APP_DEFAULTS.ACTIVE_STATUS.ONLINE,
						lastLogin: moment().valueOf(),
					},
				};
				options = {};

				await queries.findAndUpdate(Schema.users, conditions, toUpdate);

				return { status: 200, data: { token } };
			} return {
				status: RESPONSE_MESSAGES.INVALID_CREDENTIALS.STATUS_CODE,
				data: { msg: RESPONSE_MESSAGES.INVALID_CREDENTIALS.MSG },
			};
		}
		return {
			status: RESPONSE_MESSAGES.NO_USER_FOUND.STATUS_CODE,
			data: { msg: RESPONSE_MESSAGES.NO_USER_FOUND.MSG },
		};
	},

	getUsersList: async (userDetails) => {
		const aggregateArray = [
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

		const userList = await queries.aggregateData(Schema.users, aggregateArray);

		return { status: 200, data: { userList } };
	},
};

module.exports = userHandler;
