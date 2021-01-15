let factory = {
	createUserObject: (userData) => {
		let firstName = userData.firstName;
		let lastName = userData.lastName;
		let object = {
			username: userData.username,
			password: userData.password,
			email: userData.signupemail,
			firstName: firstName[0].toUpperCase() + firstName.slice(1),
			lastName: lastName[0].toUpperCase() + lastName.slice(1),
		};
		return object;
	},

	loginStatus: (id, status) => {
		let object = {
			userId: id,
			userStatus: status,
		};
		return object;
	},

	newMessage: (messageObject) => {
		return {
			text: messageObject.text,
			sendDate: messageObject.sendDate,
			sender: messageObject.sender,
			_id: messageObject._id,
			room: messageObject.room,
		};
	},
};

module.exports = factory;
