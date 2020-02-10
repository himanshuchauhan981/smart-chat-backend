const { chatHandler } = require('../handlers')

let chatController = {
    getParticularRoomMessages : async (roomID,sender,reciever)=>{
        let messageData = await chatHandler.getParticularRoomMessages(roomID, sender, reciever)
        return messageData
    }
}

module.exports = chatController