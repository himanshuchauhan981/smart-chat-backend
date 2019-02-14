const mongoose = require('mongoose');
mongoose.connect('mongodb://smartChatAdmin:smartchat0018@ds125125.mlab.com:25125/smart_chat', {useNewUrlParser: true});


const userSchema = mongoose.Schema({
    'username': String,
    'email': String,
    'password': String,
    'isConnection': String
});

const chatSchema = mongoose.Schema({
    'message': String,
    'sender' : String
});

const database = mongoose.model('chat_user_details', userSchema);
const chatDatabase = mongoose.model('community_chats',chatSchema);

module.exports.database = database;
module.exports.chatDatabase = chatDatabase;

module.exports.checkExistingUser = function (username, email, callback) {
    const query = {$or: [{username: username}, {email: email}]};
    database.find(query, callback);
};

module.exports.checkSavedUser = function (loginUsername, loginPassword, callback) {
    const query = {$and: [{username: loginUsername}, {password: loginPassword}]};
    database.find(query, callback);
};

module.exports.getUsername = function (callback) {
    database.find(callback);
};

module.exports.showCommunityChats = function(callback){
    chatDatabase.find(callback);
};

module.exports.makeOnlineConnection = function(onlineUserName,callback){
    const query = {username: onlineUserName};
    const toUpdate = {isConnection: true};
    database.updateOne(query,toUpdate,callback)
};

module.exports.makeUserOffline = function(offlineUserName, callback){
    const query = {username: offlineUserName};
    const toUpdate = {isConnection: false};
    database.updateOne(query,toUpdate, callback);
};

