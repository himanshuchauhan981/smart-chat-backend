const { userOnlineStatus,users } = require('../models')

let userListHandler = {
    makeUserOnline : async (username)=>{
        await userOnlineStatus.updateOne({username: username},{$set:{isActive: 'online', "logs.lastLogin":Date.now()}})
    },

    makeUserOffline : async (username)=>{
        await userOnlineStatus.updateOne({username: username},{$set:{isActive: 'offline'}})
    },

    showAllActiveUsers : async (username)=>{
        let allActiveUsers = await users.aggregate([
            {
                $lookup:{
                    from: 'onlineStatus',
                    localField: 'username',
                    foreignField:  'username',
                    as: 'usersInfo'
                }
            },
            {
                $project: { username:1, "usersInfo.isActive":1 }
            }
        ])

        return allActiveUsers
    }
}

module.exports = userListHandler