// Dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mailValidator = require('email-validator');

// Initial Configs
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// Helpers
const { formatMessage, formatAdminMessage } = require('./utils/message')

const userEmails = {};
const messageHistory = [];

// Authentication with E-mail
io.use((socket, next) => {
  const { email } = socket.handshake.auth;
  const emailsList = Object.values(userEmails);
  const isEmailValid = mailValidator.validate(email);

  if (isEmailValid && !emailsList.includes(email)) {
    userEmails[socket.id] = email;
    next();
  } else {
    next(new Error("invalid"));
  }
});

// Connection handling
io.on('connection', (socket) => {
  const email = socket.handshake.auth.email || null;
  
  handleNewConnection(socket, email);

  // Comando de nova mensagem
  socket.on('SEND MSG', (message) => {
    const uniqueId = messageHistory.length
    const formattedMessage = formatMessage(email, message, uniqueId);
    messageHistory.push(formattedMessage);

    io.emit('NEW MSG', formattedMessage);
  });

  // Comando para pegar os usuários conectados
  socket.on('WHOS THERE', () => {
    const emailsList = Object.values(userEmails);
    socket.emit('USERS', emailsList);
  });

  // Comando de editar mensagem existente
  socket.on('EDIT MSG', (index, newMessage) => {
    messageHistory[index].text = newMessage;

    io.emit('MSG EDITED', messageHistory[index]);
  });

  // Comando de excluir mensagem existente
  socket.on('DELETE MSG', (index) => {
    messageHistory.splice(index, 1)

    io.emit('MSG DELETED', index);
  });
  
  // Handler de Disconnect
  socket.on('disconnect', () => {
    delete userEmails[socket.id]; 

    io.emit(
      'ADM MSG',
      formatAdminMessage(`O usuário ${email} desconectou`)
    );
  });
});

const handleNewConnection = (socket, email) => {
  socket.emit('AUTH OK', { messageHistory });

  io.emit(
    'ADM MSG',
    formatAdminMessage(`O usuário ${email} se conectou!`)
  );
}

// Running server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('Server is running! Port: ', PORT);
});