// Dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


// Initial Configs
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));


// Helpers
const { formatMessage, formatAdminMessage } = require('./utils/message')
const PORT = process.env.PORT || 3000;

const userEmails = {};

// Authentication with E-mail
io.use((socket, next) => {
  console.log('new user trying to connect, id:', socket.id);
  const { email } = socket.handshake.auth;
  const emailsList = Object.values(userEmails);

  if (email && !emailsList.includes(email)) {
    userEmails[socket.id] = email;
    next();
  }
});

// Connection handling
io.on('connection', (socket) => {
  const email = socket.handshake.auth.email || null;
  console.log('user connected, email:', email);
  
  handleNewConnection(socket, email);

  socket.on('chatMessage', (msg) => {
    console.log(`Message from ${email}: ${msg}`);
    io.emit('message', formatMessage(email, msg));
  });
  
  socket.on('disconnect', () => {
    Object.entries(userEmails).forEach(([id, userEmail]) => {
      if (userEmail === email) {
        delete userEmails[id]; 
      }
    });

    console.log('user disconnected, email:', email);
    io.emit('adminMessage', formatAdminMessage(`O usuário ${email} desconectou`));
    io.emit('usersList', userEmails);
  });
});

const handleNewConnection = (socket, email) => {
  io.emit('usersList', userEmails);

  socket.emit(
    'adminMessage',
    formatAdminMessage('Conectado com sucesso!')
  );

  socket.broadcast.emit(
    'adminMessage',
    formatAdminMessage(`O usuário ${email} conectou`)
  );
}

server.listen(PORT, () => {
  console.log('Server is running! Port: ', PORT);
});