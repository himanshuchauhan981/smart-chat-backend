const express = require('express');
const app = express();
const router = express.Router();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


const port = process.env.PORT || 5000;
server.listen(app.listen(port,console.log('Server is running at port 5000')));
