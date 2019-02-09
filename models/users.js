const mongoose = require('mongoose');
mongoose.connect('mongodb://smartChatAdmin:smartchat0018@ds125125.mlab.com:25125/smart_chat',{useNewUrlParser:true})

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
   'username':String,
   'email':String,
   'password':String
});

const database = mongoose.model('chat_user_details',userSchema);

module.exports.database = database;

module.exports.checkExistingUser = function(username,email,callback){
   const query = { $or : [ { username:username }, { email:email } ] }
   database.find(query,callback);
}

module.exports.checkSavedUser = function(loginUsername, loginPassword, callback){
   const query = {$and : [ { username:loginUsername }, { password:loginPassword } ] }
   database.find(query,callback);
}
