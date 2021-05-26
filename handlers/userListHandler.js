const mongoose = require('mongoose');
const moment = require('moment');

const { users } = require('../schemas');
const { userModel } = require('../models');
const { queries } = require('../db');
const Schema = require('../schemas');
const APP_DEFAULTS = require('../config/app-defaults');

let userListHandler = {
	makeUserOnline: async (userId) => {
		let conditions = { _id: mongoose.Types.ObjectId(userId) };
		let toUpdate = {
			$set: {
				isActive: APP_DEFAULTS.ACTIVE_STATUS.ONLINE,
				lastLogin: moment().valueOf(),
			},
		};
		let options = { lean: true };

		await queries.findAndUpdate(Schema.users, conditions, toUpdate, options);
	},

	makeUserOffline: async (userId) => {
		let conditions = { _id: mongoose.Types.ObjectId(userId) };
		let toUpdate = { $set: { isActive: APP_DEFAULTS.ACTIVE_STATUS.OFFLINE } };
		let options = { lean: true };

		await queries.findAndUpdate(Schema.users, conditions, toUpdate, options);
	},

	getAllFriendsList: async (userDetails) => {
		let query = { _id: { $ne: mongoose.Types.ObjectId(userDetails.id) } };
		let projections = { firstName: 1, lastName: 1, isActive: 1, userStatus: 1 };
		let options = { lean: true };

		let friendsList = await queries.getData(
			Schema.users,
			query,
			projections,
			options
		);

		return { status: 200, data: { friendsList } };
	},

	showAllActiveUsers: async (username) => {
		let userChats = await userModel.findUserChats(username);
		let onlineUsers = await userModel.findAllUsers();
		let sender = userChats[0]._id;
		let activeUsers = onlineUsers.map((user) => {
			let len = userChats[0].chatsInfo.filter(
				(message) =>
					message.receiver.toString() === sender.toString() &&
					message.sender.toString() === user._id.toString()
			).length;
			user.messageCount = len;
			return user;
		});
		return activeUsers;
	},

	getUsersList: async (req, res) => {
		let username = req.query.currentUser;
		let userDetails = await users
			.find({
				username: { $ne: username },
			})
			.select({ username: 1 });
		return userDetails;
	},
};

module.exports = userListHandler;
