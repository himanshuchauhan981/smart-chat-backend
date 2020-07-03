const io = require('./server').io
const { userListController, chatController, groupController } = require('../controllers')
const {factories } = require('../factories')

let tempUsers = {}

makeMessageObject = (messageObject)=>{
    return {
        text: messageObject.text,
        sendDate: messageObject.sendDate,
        sender: messageObject.sender,
        _id: messageObject._id
    }
}

getAllUsers = async (username) => {
    let privateUsers = await userListController.showAllActiveUsers(username)
    let userGroups = await groupController.getUserGroups(username)
    let data = {privateUsers: privateUsers, userGroups: userGroups}
    io.emit('CONNECTED_USERS',data)
}

deleteConnectedUser = async(socket) =>{
    const { username } = socket
    delete tempUsers[`${username}`]

    await userListController.makeUserOffline(username)
    getAllUsers(username)
}

module.exports.SocketManager = socket => {

    socket.on('SET_USER_SOCKET',async (user) =>{
        socket.username = user
        tempUsers[`${user}`] = socket

        await userListController.makeUserOnline(user)
        getAllUsers(user)
    })

    socket.on('disconnect', async () =>{
        deleteConnectedUser(socket)
    })

    socket.on('JOIN_ROOM',async (roomID, sender, receiver, fullName) =>{
        socket.join(roomID)
        let roomMessages = await chatController.getParticularRoomMessages(roomID,sender,receiver)
        io.to(roomID).emit('SHOW_USER_MESSAGES',roomMessages,receiver,roomID, fullName)
    })

    socket.on('LOGOUT_USER', async ()=>{
        deleteConnectedUser(socket)
    })

    socket.on('SEND_MESSAGE',async (receiver,message,roomID) =>{
        const { username } = socket
        let savedMessage = await chatController.saveNewMessage(roomID,username,receiver,message)
        
        let messageObject = factories.newMessage(savedMessage)
        io.to(roomID).emit('RECEIVE_MESSAGE',messageObject)
    })

    socket.on('USER_TYPING_STATUS',(room,typingStatus,receiver)=>{       
        io.to(room).emit('TYPING_STATUS',typingStatus,receiver)
    })
}