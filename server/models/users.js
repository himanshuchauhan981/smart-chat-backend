const mongoose = require('mongoose')

const Schema = mongoose.Schema

const users = new Schema({
    username: {
        type: String
    },
    password:{
        type: String
    },
    email:{
        type: String
    },
    userImage: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    accountProvider: {
        providerID : {
            type: String
        },
        provider:{
            type:String,
            default: 'Email'
        }
    }
})

module.exports = mongoose.model('users',users)
