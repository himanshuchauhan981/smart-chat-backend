const mongoose = require('mongoose');
const dotenv = require('dotenv');

const initiateDB = () => {
	mongoose.set('useNewUrlParser', true);
	mongoose.set('useUnifiedTopology', true);

	dotenv.config();

	const url = `mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

	mongoose.connect(url, (err) => {
		if (err) {
			console.log('Mongo error ', err);
		} else {
			console.log('Mongoose Connection is Successful');
		}
	});
};

module.exports = initiateDB;
