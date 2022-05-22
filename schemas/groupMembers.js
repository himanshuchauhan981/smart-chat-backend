const mongoose = require('mongoose');

const { Schema } = mongoose;

const { APP_DEFAULTS } = require('../constants');

const statusEnum = [
	APP_DEFAULTS.GROUP_MEMBERS_STATUS.ACTIVE,
	APP_DEFAULTS.GROUP_MEMBERS_STATUS.DELETED,
];

const groupMembers = new Schema({

	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'users'
	},

	groupId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'groupDetails',
	},

	status: {
		type: String,
		enum: statusEnum,
		default: statusEnum[0]
	},

	createdDate: {
		type: Number,
		default: Date.now
	},

	modifiedDate: {
		type: Number,
		default: Date.now
	},
});

module.exports = mongoose.model('groupMembers', groupMembers);
