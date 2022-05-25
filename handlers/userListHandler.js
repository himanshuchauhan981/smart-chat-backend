const mongoose = require('mongoose');
const moment = require('moment');

const { queries } = require('../db');
const Schema = require('../schemas');
const { APP_DEFAULTS } = require('../constants');

const userListHandler = {

	makeUserOnline: async (userId) => {
		const conditions = { _id: mongoose.Types.ObjectId(userId) };
		const toUpdate = {
			$set: {
				isActive: APP_DEFAULTS.ACTIVE_STATUS.ONLINE,
				lastLogin: moment().valueOf(),
			},
		};
		const options = { lean: true };

		return queries.findAndUpdate(Schema.users, conditions, toUpdate, options);
	},

	makeUserOffline: async (userId) => {
		const conditions = { _id: mongoose.Types.ObjectId(userId) };
		const toUpdate = { $set: { isActive: APP_DEFAULTS.ACTIVE_STATUS.OFFLINE } };
		const options = { lean: true };

		await queries.findAndUpdate(Schema.users, conditions, toUpdate, options);
	},

	getAllFriendsList: async (userDetails) => {
		const query = { _id: { $ne: mongoose.Types.ObjectId(userDetails.id) } };
		const projections = {
			firstName: 1, lastName: 1, isActive: 1, userStatus: 1,
		};
		const options = { lean: true };

		const friendsList = await queries.getData(
			Schema.users,
			query,
			projections,
			options,
		);

		return { status: 200, data: { friendsList } };
	},
};

module.exports = userListHandler;
