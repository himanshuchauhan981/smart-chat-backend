const io = require('./server').io
const { userListController, chatController } = require('../controllers')

const connectedUsers = []

addNewUser = (user, username) => {
    if(connectedUsers.length != 0){
        let userData = connectedUsers.find(connectedUser => connectedUser.name === username)
        if(!userData){
            connectedUsers.push(user)
            console.log('connected user')
        }
    }
    else{
        connectedUsers.push(user)
        console.log('connected user')
    }
}

getAllUsers = async (username) => {
    let data = await userListController.showAllActiveUsers(username)
    io.emit('CONNECTED_USERS',data)
}

deleteConnectedUser = async(id) =>{
    let userObject = await connectedUsers.find(user => user.socketId === id)
    connectedUsers = connectedUsers.filter(user => user.socketId != id)

    await userListController.makeUserOffline(userObject.name)
    getAllUsers(userObject.name)
}

module.exports.SocketManager = socket => {
    socket.on('CONNECT_USERS', async (user, username) => {
        console.log('connecting user')
        addNewUser(user, username)
        await userListController.makeUserOnline(username)

        getAllUsers(username)
    })

    socket.on('ACTIVE_USERS',(username) =>{
        getAllUsers(username)
    })

    socket.on('disconnect',() =>{
        console.log('Disconnecting User')
        console.log(connectedUsers)
        // deleteConnectedUser(socket.id)
    })

    socket.on('JOIN_ROOM',async (roomID, sender, receiver) =>{
        socket.join(roomID)
        let roomMessages = await chatController.getParticularRoomMessages(roomID,sender,receiver)
        let data = await userListController.showAllActiveUsers(sender)
        // io.to(roomID).emit('CONNECTED_USERS',data)
        // io.to(roomID).emit('SHOW_USER_MESSAGES',roomMessages,receiver)
    })

    socket.on('LOGOUT_USER', async ()=>{
        console.lot('logging out user')
        deleteConnectedUser(socket.id)
    })
}