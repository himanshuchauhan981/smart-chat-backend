const io = require('./server').io
const { userListController, chatController } = require('../controllers')

// const connectedUsers = []
let tempUsers = {}

makeMessageObject = (messageObject)=>{
    return {
        text: messageObject.text,
        sendDate: messageObject.sendDate,
        sender: messageObject.sender,
        _id: messageObject._id
    }
}

// addNewUser = (user, username) => {
//     if(connectedUsers.length != 0){
//         let userData = connectedUsers.find(connectedUser => connectedUser.name === username)
//         if(!userData){
//             connectedUsers.push(user)
//             console.log('connected user')
//         }
//     }
//     else{
//         connectedUsers.push(user)
//         console.log('connected user')
//     }
// }

getAllUsers = async (username) => {
    let data = await userListController.showAllActiveUsers(username)
    io.emit('CONNECTED_USERS',data)
}

deleteConnectedUser = async(socket) =>{
    // let userObject = await connectedUsers.find(user => user.socketId === id)
    // connectedUsers = connectedUsers.filter(user => user.socketId != id)

    // await userListController.makeUserOffline(userObject.name)
    // getAllUsers(userObject.name)
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

    // socket.on('CONNECT_USERS', async (user, username) => {
    //     console.log('connecting user')
    //     addNewUser(user, username)
    //     await userListController.makeUserOnline(username)

    //     getAllUsers(username)
    // })

    // socket.on('ACTIVE_USERS',(username) =>{
    //     getAllUsers(username)
    // })

    socket.on('disconnect', async () =>{
        deleteConnectedUser(socket)
        // console.log('Disconnecting User')
        // console.log(connectedUsers)
        // deleteConnectedUser(socket.id)
    })

    socket.on('JOIN_ROOM',async (roomID, sender, receiver) =>{
        socket.join(roomID)
        let roomMessages = await chatController.getParticularRoomMessages(roomID,sender,receiver)
        // console.log(roomMessages)
        
        // let data = await userListController.showAllActiveUsers(sender)
        // io.to(roomID).emit('CONNECTED_USERS',data)
        io.to(roomID).emit('SHOW_USER_MESSAGES',roomMessages,receiver,roomID)
    })

    socket.on('LOGOUT_USER', async ()=>{
        deleteConnectedUser(socket)
    })

    socket.on('SEND_MESSAGE',async (receiver,message,roomID) =>{
        const { username } = socket
        let savedMessage = await chatController.saveNewMessage(roomID,username,receiver,message)
        
        let messageObject = makeMessageObject(savedMessage)
        io.to(roomID).emit('RECEIVE_MESSAGE',messageObject)
    })

    socket.on('USER_TYPING_STATUS',(room,typingStatus)=>{
        io.to(room).emit('USER_TYPING_STATUS',typingStatus)
    })
}