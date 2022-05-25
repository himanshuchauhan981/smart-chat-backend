const mongoose = require('mongoose');

const { Schema } = mongoose;

const chats = new Schema({

	sender: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'users'
	},

	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},

	text: {
		type: String,
		required: true
	},

	createdDate: {
		type: Number,
		default: Date.now
	},

	modifiedDate: {
		type: Number,
		default: Date.now
	},

	room: {
		type: String,
		required: true
	},

	isRead: {
		type: Boolean,
		default: false
	},

	isReadDate: {
		type: Number,
		default: null
	},

	fromDelete: {
		type: Boolean,
		default: false,
	},

	toDelete: {
		type: Boolean,
		default: false,
	}
});

module.exports = mongoose.model('chats', chats);
