const jwt = require('jsonwebtoken');

let tokenUtil = {
	createJWTToken: (id) => {
		let token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
			expiresIn: 60 * 60 * 60 * 60,
		});
		return token;
	},

	decodeJWTToken: (token) => {
		let tokenStatus = jwt.verify(token, process.env.JWT_SECRET);
		return tokenStatus;
	},
};

module.exports = tokenUtil;
