const { userListHandler } = require('../handlers')

let userListController = {
    makeUserOnline : async (username)=>{
        await userListHandler.makeUserOnline(username)
    },

    makeUserOffline : async (username)=>{
        await userListHandler.makeUserOffline(username)
    },

    showAllActiveUsers : async (username)=>{
        let activeUserData = await userListHandler.showAllActiveUsers(username)
        return activeUserData
    }
}

module.exports = userListController