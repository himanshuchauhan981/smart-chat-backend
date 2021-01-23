const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupChat = new Schema({
	room: {
		type: mongoose.Types.ObjectId,
	},
	sender: {
		type: mongoose.Types.ObjectId,
	},
	text: {
		type: String,
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('groupChat', groupChat);
