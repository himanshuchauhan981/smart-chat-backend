const appDefaults = {
	SOCKET_EVENT: {
		CREATE_USER_SOCKET: 'CREATE_USER_SOCKET',
		LOGOUT_USER: 'LOGOUT_USER',
		JOIN_PRIVATE_ROOM: 'JOIN_PRIVATE_ROOM',
		JOIN_GROUP_ROOM: 'JOIN_GROUP_ROOM',
		SHOW_MESSAGES: 'SHOW_MESSAGES',
		RECEIVE_MESSAGES: 'RECEIVE_MESSAGES',
		SEND_MESSAGE: 'SEND_MESSAGE',
		RECEIVE_NEW_MESSAGE: 'RECEIVE_NEW_MESSAGE',
		ONLINE_STATUS: 'ONLINE_STATUS',
		PRIVATE_MESSAGES_COUNT: 'PRIVATE_MESSAGES_COUNT',
		GROUP_MESSAGES_COUNT: 'GROUP_MESSAGES_COUNT',
		MESSAGE_ISREAD: 'MESSAGE_ISREAD',
		SOCKET_USER_DATA: 'SOCKET_USER_DATA',
		USER_TYPING_STATUS: 'USER_TYPING_STATUS',
	},
	DATABASE_MODEL: {
		USERS: 'users',
	},
	ACTIVE_STATUS: {
		ONLINE: 'online',
		OFFLINE: 'offline',
	},
	GROUP_MEMBERS_STATUS: {
		ACTIVE: 'ACTIVE',
		DELETED: 'DELETED',
	},
};

module.exports = appDefaults;
