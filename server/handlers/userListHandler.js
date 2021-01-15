const { userOnlineStatus, users, userChat } = require('../schemas');
const { userModel } = require('../models');

let userListHandler = {
	makeUserOnline: async (username) => {
		await userOnlineStatus.updateOne(
			{
				username: username,
			},
			{
				$set: {
					isActive: 'online',
					'logs.lastLogin': Date.now(),
				},
			}
		);
	},

	makeUserOffline: async (username) => {
		await userOnlineStatus.updateOne(
			{
				username: username,
			},
			{
				$set: {
					isActive: 'offline',
				},
			}
		);
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
