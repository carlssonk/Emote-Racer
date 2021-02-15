const brUsersPrivate = []; // <--- All the players that are in a PRIVATE Battle Royale Game
const brUsersPublic = []; // <--- All the players that are in a PUBLIC Battle Royale Game

const oneUsersPrivate = []; // <--- All the players that are in a PRIVATE 1 vs 1 Game
const oneUsersPublic = []; // <--- All the players that are in a PUBLIC 1 vs 1 Game


// ####################
// # BR USERS PRIVATE #
// ####################



// Join user to room
function brUserJoinPrivate(id, username, room) {
  const user = { id, username, room };

  brUsersPrivate.push(user);

  return user;
}

// Find specific user
function brGetUserPrivate(id) {
  return brUsersPrivate.find(user => user.id === id);
}

// Get ALL users with a specific USERNAME
function brGetClientsByNamePrivate(username) {
  return brUsersPrivate.filter(user => user.username === username);
}

// Leave user from a room
function brUserLeavePrivate(id) {
  const index = brUsersPrivate.findIndex(user => user.id === id);

  if (index !== -1) {
    return brUsersPrivate.splice(index, 1)[0];
  }
}

// Get all users in a room
function brGetRoomUsersPrivate(room) {
  return brUsersPrivate.filter(user => user.room.id === room);
}


// ###################
// # BR USERS PUBLIC #
// ###################


// Join user to room
function brUserJoinPublic(id, username, room) {
  const user = { id, username, room };

  brUsersPublic.push(user);

  return user;
}

// Find specific user
function brGetUserPublic(id) {
  return brUsersPublic.find(user => user.id === id);
}

// Leave user from a room
function brUserLeavePublic(id) {
  const index = brUsersPublic.findIndex(user => user.id === id);

  if (index !== -1) {
    return brUsersPublic.splice(index, 1)[0];
  }
}

// Get all users in a room
function brGetRoomUsersPublic(room) {
  return brUsersPublic.filter(user => user.room.id === room);
}


// #####################
// # 1v1 USERS PRIVATE #
// #####################


// Join user to room
function oneUserJoinPrivate(id, username, image, room) {
  const user = { id, username, image, room };

  oneUsersPrivate.push(user);

  return user;
}

// Find specific user
function oneGetUserPrivate(id) {
  return oneUsersPrivate.find(user => user.id === id);
}

// Leave user from a room
function oneUserLeavePrivate(id) {
  const index = oneUsersPrivate.findIndex(user => user.id === id);

  if (index !== -1) {
    return oneUsersPrivate.splice(index, 1)[0];
  }
}

// Get all users in a room
function oneGetRoomUsersPrivate(room) {
  console.log(oneUsersPrivate)
  return oneUsersPrivate.filter(user => user.room.id === room);
}


// #####################
// # 1v1 USERS PUBLIC #
// #####################


// Join user to room
function oneUserJoinPublic(id, username, image, room) {
  const user = { id, username, image, room };

  oneUsersPublic.push(user);

  return user;
}

// Find specific user
function oneGetUserPublic(id) {
  return oneUsersPublic.find(user => user.id === id);
}

// Leave user from a room
function oneUserLeavePublic(id) {
  const index = oneUsersPublic.findIndex(user => user.id === id);

  if (index !== -1) {
    return oneUsersPublic.splice(index, 1)[0];
  }
}

// Get all users in a room
function oneGetRoomUsersPublic(room) {
  return oneUsersPublic.filter(user => user.room.id === room);
}





module.exports = {
  // Battle Royale Private
  brUserJoinPrivate,
  brGetUserPrivate,
  brUserLeavePrivate,
  brGetRoomUsersPrivate,
  // Admin
  brGetClientsByNamePrivate,

  // Battle Royale Public
  brUserJoinPublic,
  brGetUserPublic,
  brUserLeavePublic,
  brGetRoomUsersPublic,

  // -------------------------

  // 1v1 Battle Private
  oneUserJoinPrivate,
  oneGetUserPrivate,
  oneUserLeavePrivate,
  oneGetRoomUsersPrivate,

  // 1v1 Battle Public
  oneUserJoinPublic,
  oneGetUserPublic,
  oneUserLeavePublic,
  oneGetRoomUsersPublic,

};