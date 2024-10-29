const clients = {};
let adminSocketId = null;
let chatHistory = {};
const User = require('../models/users.model');

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('User connected: ' + socket.id);

        socket.on('registerAdmin', () => {
            adminSocketId = socket.id;
            console.log('Admin connected: ' + adminSocketId);
            // Gửi danh sách client cho admin khi admin đăng ký
            io.to(adminSocketId).emit('clientList', clients);
        });

        socket.on('registerClient', async (userId) => {
            try {
                const user = await User.findById(userId);
                clients[userId] = { userName: user.name, socketId: socket.id, userId: userId };
                chatHistory[userId] = chatHistory[userId] || [];
                console.log(`${user.name} is connected with ID: ${socket.id}; userId: ${userId}`);
                // Thông báo cho admin về client mới
                if (adminSocketId) {
                    io.to(adminSocketId).emit('clientList', clients);
                }
            } catch (error) {
                console.log('error: ', error.message);
            }
            
        });

        // gửi tin nhắn đến cho admin
        socket.on('clientMessage', async (message, userId) => {
            try {
                if (adminSocketId) {
                    const user = await User.findById(userId);
                    const chatMessage = { user: user.name, text: message, userId: userId };
                    chatHistory[userId].push(chatMessage);
                    io.to(adminSocketId).emit('newMessage', chatMessage);
                }
            } catch (error) {
                console.log('error: ', error.message);
            }
        });

        // gửi tin nhắn đến client
        socket.on('adminPrivateMessage', ({ toClient, message }) => {
            const clientSocketId = clients[toClient].socketId;
            if (clientSocketId) {
                const chatMessage = { user: 'Admin', text: message };
                chatHistory[toClient].push(chatMessage);
                io.to(clientSocketId).emit('newMessage', chatMessage);

                console.log(chatHistory);
                console.log(clients);
            } else {
                console.log(`Client ${toClient} not found`);
            }
        });

        socket.on('getChatHistory', (userId) => {
            if (chatHistory[userId]) {
                io.to(adminSocketId).emit('chatHistory', chatHistory[userId]);
            }
        });

        socket.on('disconnect', () => {
            for (const [username, socketId, userId] of Object.entries(clients)) {
                if (socketId === socket.id) {
                    delete clients[userId];
                    break;
                }
            }
            // Cập nhật danh sách client sau khi ai đó ngắt kết nối
            if (adminSocketId) {
                io.to(adminSocketId).emit('clientList', Object.keys(clients));
            }
            console.log('User disconnected: ' + socket.id);
        });
    });
};
