const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupDetails = new Schema({

	name: {
		type: String,
		required: true
	},

	status: {
		type: String,
		default: null
	},

	image: {
		type: String,
		default: null
	},

	admin: {
		type: mongoose.Types.ObjectId
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

module.exports = mongoose.model('groupDetails', groupDetails);
