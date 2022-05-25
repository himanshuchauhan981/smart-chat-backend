const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupChat = new Schema({

	room: {
		type: mongoose.Types.ObjectId,
		required: true,
	},

	sender: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'users',
	},

	text: {
		type: String,
		required: true,
	},

	createdDate: {
		type: Number,
		default: Date.now,
	},

	modifiedDate: {
		type: Number,
		default: Date.now,
	},
});

module.exports = mongoose.model('groupChat', groupChat);
