const users = [];

// Join user to chat
function userJoin(id, username, group) {
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return null; // Return null to indicate that the username is not available
  }
  const user = { id, username, group };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get group users
function getgroupUsers(group) {
  return users.filter(user => user.group === group);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getgroupUsers
};
