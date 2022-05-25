const mongoose = require('mongoose');

const { Schema } = mongoose;

const users = new Schema({

	username: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	firstName: {
		type: String,
		required: true,
	},

	lastName: {
		type: String,
		required: true,
	},

	image: {
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

	userStatus: {
		type: String,
		default: 'Hey there. I am using smart chat',
	},

	isActive: {
		type: String,
		default: 'offline',
	},

	lastLogin: {
		type: Number,
		default: null,
	},

	lastPasswordReset: {
		type: Number,
		default: null,
	},
});

module.exports = mongoose.model('users', users);
