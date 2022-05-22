const jwt = require('jsonwebtoken');

const tokenUtil = {

	createJWTToken: (id) => {

		const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
			expiresIn: 60 * 60 * 60 * 60,
		});
		return token;
	},

	decodeJWTToken: (token) => {
		const tokenStatus = jwt.verify(token, process.env.JWT_SECRET);
		return tokenStatus;
	},
};

module.exports = tokenUtil;
