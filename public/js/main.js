const chatForm = document.querySelector('#chat-form');
const emailForm = document.querySelector('#email-form');
const chatMessages = document.querySelector('.chat-messages');

let email = null;
let socket = null;

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();

  email = event.target.elements.email.value;
  
  socket = io({ auth: { email }});

  socket.on('connect', () => {
    socket.on('AUTH OK', (params) => {
      document.querySelector('.email-container').style.display = 'none';
      document.querySelector('.chat-container').style.display = 'block';

      const { messageHistory } = params;
      
      if (messageHistory) {
        messageHistory.forEach(outputMessage);
        scrollToEndOfMessages();
      }
    });

    socket.on('NEW MSG', (message) => {
      outputMessage(message);
      scrollToEndOfMessages();
    });

    socket.on('ADM MSG', (admMessage) => {
      outputAdminMessage(admMessage);
      scrollToEndOfMessages();
    });

    socket.on('MSG EDITED', (newMessage) => {
      outputEditedMessage(newMessage);
    });

    socket.on('MSG DELETED', (index) => {
      const messageDiv = document.querySelector(`#message-${index}`);
      messageDiv.remove();
    });

    socket.on('USERS', (users) => {
      updateUsersList(users);
    });
  });

  socket.on('connect_error', () => {
    alert('Email inválido!');
  });
});



chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;

  socket.emit('SEND MSG', msg);

  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

const outputMessage = (message) => {
  const div = document.createElement('div');
  
  const messageClass = message.email === email ? 'my-message' : 'message';
  div.classList.add(messageClass);
  div.id = `message-${message.id}`;

  div.innerHTML = `
    <p class="message-header">${message.email} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>

    <div class="chat-edit-form-container" style="display: none">
      <input
        id="msg"
        type="text"
        placeholder=" Escreva a mensagem..."
        required
        autocomplete="off"
      />
      <button
        class="btn-leave" 
        style="margin-left: 10px;"
        onClick="editMessage(${message.id})"
      >
        <i class="fa-solid fa-paper-plane"></i>
          Editar
      </button>
    </div>

    <div class="message-icons-container">
      <a class="message-icon" onClick="deleteMessage(${message.id})"><i class="fa-solid fa-trash"></i></a>
      <a class="message-icon" onClick="showEditMessageForm(${message.id}, '${message.text}')"><i class="fa-solid fa-pen"></i></a>
    </div>
  `;

  chatMessages.appendChild(div);
};

const outputEditedMessage = (message) => {
  const div = document.querySelector(`#message-${message.id}`);
  
  div.innerHTML = `
    <p class="message-header">${message.email} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>

    <div class="chat-edit-form-container" style="display: none">
      <input
        id="msg"
        type="text"
        placeholder=" Escreva a mensagem..."
        required
        autocomplete="off"
      />
      <button
        class="btn-leave" 
        style="margin-left: 10px;"
        onClick="editMessage(${message.id})"
      >
        <i class="fa-solid fa-paper-plane"></i>
          Editar
      </button>
    </div>

    <div class="message-icons-container">
      <a class="message-icon" onClick="deleteMessage(${message.id})"><i class="fa-solid fa-trash"></i></a>
      <a class="message-icon" onClick="showEditMessageForm(${message.id}, '${message.text}')"><i class="fa-solid fa-pen"></i></a>
    </div>
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

  socket.emit('WHOS THERE');
};

const updateUsersList = (usersList) => {
  const usersListElement = document.querySelector('.users-list');
  const htmlList = Object.values(usersList).map((user) => `<span>${user}</span>`).join('');
  usersListElement.innerHTML = htmlList;
}

const deleteMessage = (id) => {
  socket.emit('DELETE MSG', id);
}

const showEditMessageForm = (id, text) => {
  const messageDiv = document.querySelector(`#message-${id}`);
  const messageText = messageDiv.querySelector('.text');
  const editForm = messageDiv.querySelector('.chat-edit-form-container');
  
  editForm.querySelector('#msg').setAttribute('value', text);
  
  messageText.style.display = 'none';
  editForm.style.display = 'flex';
}

const editMessage = (id) => {
  const messageDiv = document.querySelector(`#message-${id}`);
  const messageText = messageDiv.querySelector('.text');
  const editForm = messageDiv.querySelector('.chat-edit-form-container');
  const newMsg = editForm.querySelector('#msg').value;

  socket.emit('EDIT MSG', id, newMsg);

  messageText.style.display = 'block';
  editForm.style.display = 'none';
}

const scrollToEndOfMessages = () => {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

