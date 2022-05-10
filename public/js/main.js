const chatForm = document.querySelector('#chat-form');
const emailForm = document.querySelector('#email-form');
const chatMessages = document.querySelector('.chat-messages');

let email = null;
let socket = null;

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();

  email = event.target.elements.email.value;
  
  socket = io({
    auth: { email }
  });

  socket.on("connect", () => {
    document.querySelector('.email-container').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'block';

    socket.on('message', (messageSent) => {
      console.log(messageSent);
      outputMessage(messageSent);
    
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('adminMessage', (messageSent) => {
      outputAdminMessage(messageSent);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('usersList', (users) => {
      updateUsersList(users);
    });
  });

  socket.on("connect_error", () => {
    event.target.elements.email.value = '';
    alert('Email inválido!');
  });
});



chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;

  socket.emit('chatMessage', msg);

  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

const outputMessage = (message) => {
  const div = document.createElement('div');
  
  const messageClass = message.email === email ? 'my-message' : 'message';
  div.classList.add(messageClass);

  div.innerHTML = `
    <p class="message-header">${message.email} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;

  chatMessages.appendChild(div);
};

const outputAdminMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('admin-message');
  div.innerHTML = `
    <p class="message-header">
      ${message.text} <span>${message.time}</span>
    </p>
  `;

  chatMessages.appendChild(div);
};

const toggleUsersList = () => {
  const chatUsers = document.querySelector('.chat-users')
  const currentDisplay = chatUsers.style.display;
  
  const display = (!currentDisplay || currentDisplay === 'none') ? 'block' : 'none';
  chatUsers.style.display = display;
};

const updateUsersList = (usersList) => {
  const usersListElement = document.querySelector('.users-list');
  const htmlList = Object.values(usersList).map((user) => `<span>${user}</span>`).join('');
  usersListElement.innerHTML = htmlList;
}

