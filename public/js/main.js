const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const groupName = document.getElementById('group-name');
const userList = document.getElementById('users');

// Get username and group from URL
const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatgroup
socket.emit('joingroup', { username, group });
socket.on('invalid', (username) => {
  alert(`A person with username '${username}' have already joined. Please choose a different username.`);
  window.location = '../index.html';
});

// Get group and users
socket.on('groupUsers', ({ group, users }) => {
  outputgroupName(group);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add group name to DOM
function outputgroupName(group) {
  groupName.innerText = group;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat group
document.getElementById('leave-btn').addEventListener('click', () => {
  const leavegroup = confirm('Are you sure you want to leave the chatgroup?');
  if (leavegroup) {
    window.location = '../index.html';
  } else {
  }
});
