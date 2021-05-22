const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chats = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
	},
	createdDate: {
		type: Number,
		default: Date.now,
	},
	modifiedDate: {
		type: Number,
		default: Date.now,
	},
	room: {
		type: String,
		required: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	isReadDate: {
		type: Number,
		default: null,
	},
});

module.exports = mongoose.model('chats', chats);
