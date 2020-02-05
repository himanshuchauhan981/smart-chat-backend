let factory = {
    createUserObject : (userData) =>{
        let object = {
            "username": userData.signupusername,
            "password": userData.signuppassword,
            "email": userData.signupemail
        }
        return object
    },

    userLoginStatusObject : (name,status) =>{
        let object = {
            username: name,
            userStatus: status
        }
        return object
    }
}

module.exports = factory