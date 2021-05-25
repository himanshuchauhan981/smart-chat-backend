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
	NO_TOKEN: {
		STATUS_CODE: 401,
		MSG: 'Token is required',
	},
	INVALID_TOKEN: {
		STATUS_CODE: 401,
		MSG: 'Invalid token',
	},
	CREATE_GROUP: {
		STATUS_CODE: 200,
		MSG: 'Group created successfully',
	},
	ADD_NEW_MEMBERS: {
		STATUS_CODE: 200,
		MSG: 'New members added successfully',
	},
};

module.exports = RESPONSE_MESSAGES;
