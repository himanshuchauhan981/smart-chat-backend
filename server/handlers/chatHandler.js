const { userChat } = require('../models')

const setReadMessagesStatus = async (room,receiver) =>{
    await userChat.updateMany(
        {
            $and:[
                {room: room},
                {receiver: receiver},
                {isRead: false}
            ]
        },
        {
            $set:{
                isRead: true
            }
        }
    )
}

let chatHandler = {
    getParticularRoomMessages : async (roomID,sender,reciever) =>{
        let messageData = await userChat.find({room: roomID},{text:1, sendDate:1, sender: 1})
        await setReadMessagesStatus(roomID, sender, reciever)
        return messageData
    },

    saveNewMessage : async (roomID,sender,receiver,message) =>{
        let messageObject = new userChat({
            sender: sender,
            receiver: receiver,
            room: roomID,
            text: message
        })
        let savedMessage = await messageObject.save()
        return savedMessage
    }
}

module.exports = chatHandler