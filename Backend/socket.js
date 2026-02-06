const socketIo= require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

// Initialize the socket.io server
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: [
    'http://localhost:5173', 
    'https://f7z7r4m1-5173.inc1.devtunnels.ms'
], // Your frontend URL
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            
            

            console.log(`User joined: ${userId} as ${userType}`);

            if(userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if(userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const {userId, location} = data;
            
            if(!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            const updatedCaptain = await captainModel.findByIdAndUpdate(userId, { 
               location: {
            type: 'Point',
            coordinates: [
                parseFloat(location.lng), // longitude first
                parseFloat(location.ltd)   // latitude
            ]
        }
    }, { new: true });
            console.log(`Captain ${userId} updated location:`, updatedCaptain.location);
        });

        // socket.on('connect', () => {
        //     console.log(`User connected: ${socket.id}`);
        // });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
// Send a message to a specific socket ID
function sendMessageToSocketId(socketId, messageObject) {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io is not initialized. Call initializeSocket first.');
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};