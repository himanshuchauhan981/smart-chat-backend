const { userOnlineStatus,users,userChat } = require('../models')

let userListHandler = {
    makeUserOnline : async (username)=>{
        await userOnlineStatus.updateOne(
            {
                username: username
            },
            {
                $set:{
                    isActive: 'online',
                    'logs.lastLogin':Date.now()
                }
            }
        )
    },

    makeUserOffline : async (username)=>{
        await userOnlineStatus.updateOne(
            {
                username: username
            },
            {
                $set:{
                    isActive: 'offline'
                }
            }
        )
    },

    showAllActiveUsers : async (username)=>{
        let userMessages = await userChat.find(
            {
                $and:[
                    {
                        "sender":{$ne:username}
                    },
                    {
                        "isRead": false
                    }
                ]
            }
        ).select({sender:1,sendDate:1,receiver:1})
        
        let onlineUsers = await users.aggregate([
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

        onlineUsers = onlineUsers.map(function(user){
            let len = userMessages.filter(message => message['sender'] === user['username'] && message['receiver'] === username).length
            return { ...user,messageCount:len }
        })



        return onlineUsers
    }
}

module.exports = userListHandler