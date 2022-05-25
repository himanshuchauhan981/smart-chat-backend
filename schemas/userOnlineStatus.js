const mongoose = require('mongoose');

const { Schema } = mongoose;

const userLogin = new Schema(
	{

		userId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		userStatus: {
			type: String,
			required: true,
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
	{ collection: 'onlineStatus' },
);

module.exports = mongoose.model('onlineStatus', userLogin);
