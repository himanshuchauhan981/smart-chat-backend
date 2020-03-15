let factory = {
    createUserObject : (userData) =>{
        let object = {
            "username": userData.username,
            "password": userData.password,
            "email": userData.signupemail
        }
        return object
    },

    loginStatus : (name,status) =>{
        let object = {
            username: name,
            userStatus: status
        }
        return object
    },

    newMessage : (messageObject)=>{
        return {
            text: messageObject.text,
            sendDate: messageObject.sendDate,
            sender: messageObject.sender,
            _id: messageObject._id,
            room: messageObject.room
        }
    }
}

module.exports = factory