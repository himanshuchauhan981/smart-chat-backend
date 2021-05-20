const RESPONSE_MESSAGES = {
	EXISTING_USER: {
		STATUS_CODE: 409,
		MSG: 'Username already existed',
	},
	INVALID_CREDENTIALS: {
		STATUS_CODE: 400,
		MSG: 'Invalid username or password',
	},

	NO_USER_FOUND: {
		STATUS_CODE: 400,
		MSG: 'No user found',
	},
};

module.exports = RESPONSE_MESSAGES;
