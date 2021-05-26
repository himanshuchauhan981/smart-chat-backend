const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userLogin = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
		},
		userStatus: {
			type: String,
		},
		isActive: {
			type: String,
			default: 'offline',
		},
		logs: {
			lastLogin: {
				type: Date,
				default: null,
			},
			lastPasswordReset: {
				type: Date,
				default: null,
			},
		},
	},
	{ collection: 'onlineStatus' }
);

module.exports = mongoose.model('onlineStatus', userLogin);
