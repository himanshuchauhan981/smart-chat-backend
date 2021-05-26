const { userOnlineStatus } = require('../schemas');

class OnlineStatus {
	constructor() {
		this.userOnlineStatusModel = userOnlineStatus;
	}

	updateUserOnlineStatus = (userId, status) => {
		return this.userOnlineStatusModel.updateOne(
			{ userId: userId },
			{
				$set: status
					? {
							isActive: 'online',
							'logs.lastLogin': Date.now(),
					  }
					: {
							isActive: 'offline',
					  },
			}
		);
	};
}

module.exports = new OnlineStatus();
