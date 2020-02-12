const { chatHandler } = require('../handlers')

let chatController = {
    getParticularRoomMessages : async (roomID,sender,receiver)=>{
        let messageData = await chatHandler.getParticularRoomMessages(roomID, sender, receiver)
        return messageData
    },

    saveNewMessage : async (roomID,sender,receiver,message) =>{
        let savedMessage = await chatHandler.saveNewMessage(roomID,sender,receiver,message)
        return savedMessage
    }
}

module.exports = chatController