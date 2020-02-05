const io = require('./server').io
const { userListController } = require('../controllers')

let connectedUsers = []

addNewUser = (user, username) => {
    let userData = connectedUsers.find(connectedUser => connectedUser.username === username)
    if (!userData) connectedUsers.push(user)
}

getAllUsers = async (username) => {
    let data = await userListController.showAllActiveUsers(username)
    io.emit('CONNECTED_USERS',data)
}

module.exports.SocketManager = socket => {
    socket.on('CONNECT_USERS', async (user, username) => {
        addNewUser(user, username)
        await userListController.makeUserOnline(username)

        getAllUsers(username)
    })

    socket.on('ACTIVE_USERS',(username) =>{
        getAllUsers(username)
    })
}