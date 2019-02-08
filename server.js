const express = require('express');
const app = express();
const router = express.Router();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


app.post('/chat/save_details/:data',function(request,response,next,username){
   console.log(data);
   return 200;

});

const port = process.env.PORT || 5000;
server.listen(app.listen(port,console.log('Server is running at port 5000')));
