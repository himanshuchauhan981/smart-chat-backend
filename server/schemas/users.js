const mongoose = require('mongoose')

const Schema = mongoose.Schema

const users = new Schema({
    username: {
        type: String
    },
    password:{
        type: String
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    userImage: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    groupIds:[{
        groupId : {
            type: String
        }
    }]
})

module.exports = mongoose.model('users',users)
