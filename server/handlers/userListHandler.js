const { userOnlineStatus, users, userChat } = require('../schemas');
const { userModel, onlineStatusModel } = require('../models');

let userListHandler = {
	makeUserOnline: async (username) => {
		let userData = await userModel.findByUsername(username);
		await onlineStatusModel.updateUserOnlineStatus(userData._id, true);
	},

	makeUserOffline: async (username) => {
		let userData = await userModel.findByUsername(username);
		await onlineStatusModel.updateUserOnlineStatus(userData._id, false);
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

	showAllUserNames: async (req, res) => {
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
