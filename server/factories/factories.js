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
    }
}

module.exports = factory