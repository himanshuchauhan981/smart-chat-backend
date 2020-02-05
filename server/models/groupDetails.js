const mongoose = require('mongoose')

const Schema = mongoose.Schema

const groupDetails = new Schema({
    room:{
        type: String
    },
    members: [{
        name:{
            type: String
        },
        memberCreatedDate:{
            type: Date,
            default: Date.now
        }
    }],
    groupCreatedDate:{
        type: Date,
        default: Date.now
    },
    admin:{
        type: String
    },
    groupStatus: {
        type: String
    },
    groupImage:{
        type: String
    }
})

module.exports = mongoose.model('groupDetail',groupDetails)