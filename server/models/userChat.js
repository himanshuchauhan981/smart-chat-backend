const mongoose = require('mongoose')

const Schema  = mongoose.Schema

const userChat = new Schema({
    sender:{
        type: String
    },
    receiver: {
        type: String
    },
    text:{
        type: String
    },
    sendDate:{
        type: Date,
        default: Date.now
    },
    room:{
        type: String
    },
    isRead:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('userChat',userChat)