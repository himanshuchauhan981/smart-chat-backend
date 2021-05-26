const jwt = require('jsonwebtoken');

const RESPONSE_MESSAGES = require('../config/response-messages');
const { tokenUtil } = require('../utils');

module.exports = {
	validateToken: (req, res, next) => {
		const token = req.headers.authorization;
		let result;
		if (token) {
			const options = {};
			try {
				result = tokenUtil.decodeJWTToken(token);
				req.user = result;
				next();
			} catch (err) {
				console.log(err);
				result = {
					error: RESPONSE_MESSAGES.INVALID_TOKEN.MSG,
					status: RESPONSE_MESSAGES.INVALID_TOKEN.STATUS_CODE,
				};
				res.status(401).send(result);
			}
		} else {
			result = {
				error: RESPONSE_MESSAGES.NO_TOKEN.MSG,
				status: RESPONSE_MESSAGES.NO_TOKEN.STATUS_CODE,
			};
			res.status(401).send(result);
		}
	},
};
