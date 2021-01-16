const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupDetails = new Schema({
	room: {
		type: String,
	},
	members: [
		{
			memberId: {
				type: Schema.Types.ObjectId,
			},
			memberCreatedAt: {
				type: Date,
				default: Date.now,
			},
		},
	],
	groupCreatedAt: {
		type: Date,
		default: Date.now,
	},
	admin: {
		type: Schema.Types.ObjectId,
	},
	groupStatus: {
		type: String,
	},
	groupImage: {
		type: String,
	},
});

module.exports = mongoose.model('groupDetail', groupDetails);
