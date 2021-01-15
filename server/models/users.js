const { users } = require('../schemas');

class Users {
	constructor() {
		this.userModel = users;
	}

	findByUsername = (username) => {
		return this.userModel.findOne({ username });
	};

	create = (users) => {
		let userObject = new this.userModel(users);
		return userObject.save();
	};

	findUserChats = (username) => {
		return this.userModel.aggregate([
			{ $match: { $expr: { $eq: ['$username', username] } } },
			{
				$lookup: {
					from: 'userchats',
					let: { sender: '$sender', isRead: '$isRead' },
					pipeline: [
						{
							$match: {
								$and: [
									{
										$expr: {
											$ne: ['$$sender', '$_id'],
										},
									},
									{
										$expr: {
											$eq: ['$isRead', false],
										},
									},
								],
							},
						},
					],
					as: 'chatsInfo',
				},
			},
			{
				$project: {
					'chatsInfo.sender': 1,
					'chatsInfo.receiver': 1,
					'chatsInfo.sendDate': 1,
				},
			},
		]);
	};

	findAllUsers = () => {
		return this.userModel.aggregate([
			{
				$lookup: {
					from: 'onlineStatus',
					localField: '_id',
					foreignField: 'userId',
					as: 'userInfo',
				},
			},
			{ $unwind: '$userInfo' },
			{
				$project: {
					username: 1,
					'userInfo.isActive': 1,
					firstName: 1,
					lastName: 1,
				},
			},
		]);
	};
}

module.exports = new Users();
