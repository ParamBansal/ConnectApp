import {Server} from 'socket.io'
import express from 'express';
import http from 'http'
const app=express();

const server=http.createServer(app)

// New, corrected code for socket/socket.js
const io = new Server(server, {
    cors: {
        origin: [
            'https://connectapp-k6fs.onrender.com', // Deployed Frontend
            'http://localhost:5173'               // Local Development Frontend
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const userSocketMap={};//this map stores socket ids corresponding the user id; userId->socketId
export const getReceiverSocketId=(receiverId)=>userSocketMap[receiverId];

io.on('connection',(socket)=>{
    const userId= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
        console.log(`User connected: UserId= ${userId}, SOcketId={socket.id}`)
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        if(userId){
            
            console.log(`User disconnected: UserId= ${userId}, SOcketId={socket.id}`)
            delete userSocketMap[userId]
        }
    })
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
})

export {app,server,io};