const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash  = require('flash');
const socket = require('socket.io');

const User = require('./models/users.js');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.post('/chat/save_details',function(request,response){
   const data = new User.database({
      username:request.body.username,
      email:request.body.email,
      password:request.body.password
   })

   User.checkExistingUser(request.body.username,request.body.email,function(err,user){
      if(user.length!=0){
         if(user[0].username == request.body.username && user[0].email != request.body.email){
            response.status(200).json({'message':'Username Exists'});
         }
         else if(user[0].username != request.body.username && user[0].email == request.body.email){
            response.status(200).json({'message':'Email already existed'});
         }
         else if(user[0].username == request.body.username && user[0].email == request.body.email){
            response.status(200).json({'message':'Username Exists'});
         }
      }
      else{
         data.save(function(){
            console.log('User added');
            response.status(200).json({'isSignUpSuccessful':true});
         })
      }
   })
});

app.post('/chat/check_details',function(request,response){
   User.checkSavedUser(request.body.loginUsername, request.body.loginPassword, function(err,user){
      if(user.length == 0){
         response.status(200).json({'message':'Incorrect username or password'});
      }
      else{
         response.status(200).json({'isUserCorrect':true});
      }
   })
})

const port = process.env.PORT || 1234
const server = app.listen(port, console.log('Server Started at port 1234'))

var io = socket(server);

io.on('connection',function(socket){
   console.log('Made new socket connection on', socket.id);
   socket.on('join',function(data){
      // Joining User to the room
      socket.join("community");
      console.log(socket.id + " has joined to community room");
      socket.broadcast.to("community").emit('New user joined',{user:data.user,message:'has joined this room'});
   });

   //Joined User leaving the room
   socket.on('leave',function(data){
      console.log(socket.id + "has left the community room");
      socket.broadcast.to("community").emit('left room',{user:data.user, message:' has left the room'});
      socket.leave("community");
   })

   //Sending Messages to community joinRoom
   socket.on('message',function(data){
      io.in("community").emit('new message',{user:data.user, message: data.message})
   })
})
