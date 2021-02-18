const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 8080;
const io = require("socket.io")(server, { perMessageDeflate: false });
const schedule = require("node-schedule");
const { v4: uuidv4 } = require('uuid');
const {
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

  // ---------------------------

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
} = require('./utils/users');

const emotesServer = require("./utils/emotes");


app.use(express.static(`${__dirname}/public`));


// #################################################################################
// ############################### SOCKET IO #######################################
// #################################################################################


// Array that contains ALL rooms, the only reason we use this list is so we can loop over rooms and find one that a user joins when he is searching for a public br game,
// hence we dont need array of romms in private mode cuz we dont need to loop over rooms to find one.
let brRoomsList = [];
let oneRoomsList = [];
let lobbyCountdownTimers = [];


io.on("connection", (socket) => {

  // ########################################
  // #### BATTLE ROYALE PUBLIC HANDLING #####
  // ########################################

  socket.on("quickPlay", (username, nameColor, profileImg) => {

    // Check if there are any available empty slots in rooms
    if(brRoomsList.some(e => e.userLength < 12) && brRoomsList.some(e => e.isPlaying === false)) {
      // Sort rooms from high to low
      const roomsDescending = brRoomsList.sort((a, b) => b.userLength - a.userLength);
      // Loop through the array until we find an empty spot
      for(let room of roomsDescending) {
        if(room.userLength < 12 && room.isPlaying === false) {
          console.log(1)
          room.userLength++;
          joinRoom(room.id, room.userLength);
          // Set timer
          // handleLobbyTimer(room.id, room.userLength, socket.id)
          break;
        }
      }
    } else {
      createNewRoom();
    }


    function joinRoom(roomId, userLength) {
      // Set room
      const room = {id: roomId, isPrivate: false}
      // Create new user
      const user = brUserJoinPublic(socket.id, username, nameColor, profileImg, room)
      // Join user to roomId
      socket.join(user.room.id)
      // Send all users currently in the room to client side
      io.to(user.room.id).emit("joinPublicLobby", brGetRoomUsersPublic(user.room.id), room, socket.id); // True statement refers to that this is a public lobby
      // Start Lobby Timer
      if(userLength === 3) startLobbyTimer(roomId)
      // Start game if FULL
      if(userLength === 12) {
        clearTimeoutLobby(roomId) // Clears timeout
        requestStartGamePublic(roomId) // Starts game
      }
    }

    function createNewRoom() {
    // Create new room
    const room = {id: uuidv4(), isPrivate: false}
    // Create new user
    const user = brUserJoinPublic(socket.id, username, nameColor, profileImg, room)
    // Set Public Room
    brRoomsList.push({id: room.id, isPrivate: false, isPlaying: false, userLength: 1})
    // Join user to roomId
    socket.join(user.room.id);
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPublicLobby', room);
    }

  })


  // Starts a 20 seconds timer, so if lobby is not full, game will start automatically
  function startLobbyTimer(roomId) {

    this.clearTimeoutLobby = function(roomId) {

      for(let i = 0; i < lobbyCountdownTimers.length; i++) {
        console.log(lobbyCountdownTimers[i])
        console.log(lobbyCountdownTimers[i]._timerArgs[0])
        console.log(roomId)
        if(lobbyCountdownTimers[i]._timerArgs[0] === roomId) {

          clearTimeout(lobbyCountdownTimers[i])
          lobbyCountdownTimers.splice(i, 1)

        }
      }

    }

    // Clear possible duplicates
    clearTimeoutLobby(roomId);
    
    lobbyCountdownTimers.push(setTimeout(() => requestStartGamePublic(roomId), 20000, roomId))

  }


  // ########################################
  // #### BATTLE ROYALE PRIVATE HANDLING ####
  // ########################################

  socket.on("createPrivateLobby", (username, nameColor, profileImg) => {
    // Create new room
    const room = {id: uuidv4(), isPrivate: true, isPlaying: false}
    // Create new user
    const user = brUserJoinPrivate(socket.id, username, nameColor, profileImg, room)
    // Join user to roomId
    socket.join(user.room.id);
    // Create a route for that room so people can join it by link
    app.get(`/battle-royale/?${room.id}`, (req, res) => {
      res.sendFile(`${__dirname}/public/index.html`);
    });
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPrivateLobby', room);
  })

  socket.on("requestJoin", (roomId, username, nameColor, profileImg) => {
    const theRoom = brGetRoomUsersPrivate(roomId);
    if(theRoom.length > 0) {
      if(theRoom.length >= 12 || theRoom[0].room.isPlaying === true) {
        socket.emit("roomIsFull")
        // Room is full
        return
      }
    }

    // Set room 
    const room = {id: roomId, isPrivate: true, isPlaying: false}
    // Create new user
    const user = brUserJoinPrivate(socket.id, username, nameColor, profileImg, room)
    // Join user to roomId
    socket.join(user.room.id)
    // Send all users currently in the room to client side
    io.to(user.room.id).emit("joinPrivateLobby", brGetRoomUsersPrivate(roomId), room, socket.id);
  })

  socket.on("gameEndPrivate", (roomId) => {
    const theRoom = brGetRoomUsersPrivate(roomId)
    for(let i = 0; i < theRoom.length; i++) {
      theRoom[i].room.isPlaying = false;
    }
  })


  // ###########################
  // #### GAME LOGIC WIRING ####
  // ###########################

  // Send signal to all users
  socket.on("requestStartGamePrivate", (roomId) => {
    const theRoom = brGetRoomUsersPrivate(roomId)
    for(let i = 0; i < theRoom.length; i++) {
      theRoom[i].room.isPlaying = true;
    }

    const randomEmoteIndex = Math.floor(Math.random() * emotesServer.length);

    io.to(roomId).emit("startGame", emotesServer, randomEmoteIndex, theRoom);
  })


  function requestStartGamePublic(roomId) {
    clearTimeoutLobby(roomId); // Clear lobby timer since we are now gonna start game

    const theRoom = brGetRoomUsersPublic(roomId)
    if(theRoom.length === 1) return;

    const room = brRoomsList.findIndex(room => room.id === roomId)
    brRoomsList[room].isPlaying = true;

    const randomEmoteIndex = Math.floor(Math.random() * emotesServer.length);

    io.to(roomId).emit("startGame", emotesServer, randomEmoteIndex, theRoom);
  }


  socket.on("handleEndRound", (roomId) => {
    io.to(roomId).emit("handleEndRound");
  });


  socket.on("requestNextRound", (roomId, localEmotes) => {
    const randomEmoteIndex = Math.floor(Math.random() * localEmotes.length);
    io.to(roomId).emit("nextRound", randomEmoteIndex);
  });

  
  socket.on("userCorrect", (roomId, socketId, profileImg) => {
    io.to(roomId).emit("userCorrect", socketId, profileImg);
  })
  socket.on("userWrong", (roomId, socketId) => {
    io.to(roomId).emit("userWrong", socketId);
  })
  socket.on("userEliminated", (roomId, socketId, profileImg) => {
    io.to(roomId).emit("userEliminated", socketId, profileImg);
  })


  // ########################################
  // ####### 1 VS 1 PUBLIC HANDLING #########
  // ########################################

  socket.on("quickPlay1v1", (username, nameColor, profileImg) => {

    // Check if there are any available empty slots in rooms
    if(oneRoomsList.some(e => e.userLength < 2) && oneRoomsList.some(e => e.isPlaying === false)) {

      // Find a room that the user can join
      for(let room of oneRoomsList) {
        console.log(room)
        if(room.userLength < 2 && room.isPlaying === false) {
          room.userLength++;
          joinRoom(room.id);
          break;
        }
      }

    } else {
      createNewRoom();
    }

    function joinRoom(roomId) {
      console.log("ONCE")
      // Set room
      const room = {id: roomId, isPrivate: false}
      // Create new user
      const user = oneUserJoinPublic(socket.id, username, nameColor, profileImg, room)
      // Join user to roomId
      socket.join(user.room.id)
      // Send all users currently in the room to client side
      io.to(user.room.id).emit("joinPublicLobby1v1", oneGetRoomUsersPublic(user.room.id), room); // True statement refers to that this is a public lobby
    }

    function createNewRoom() {
    // Create new room
    const room = {id: uuidv4(), isPrivate: false}
    // Create new user
    const user = oneUserJoinPublic(socket.id, username, nameColor, profileImg, room)
    // Set Public Room
    oneRoomsList.push({id: room.id, isPrivate: false, isPlaying: false, userLength: 1})
    // Join user to roomId
    console.log(user)
    socket.join(user.room.id);
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPublicLobby1v1', room);
    }

  })


  // ########################################
  // ####### 1 VS 1 PRIVATE HANDLING ########
  // ########################################

  socket.on("createPrivateLobby1v1", (username, nameColor, profileImg) => {
    // Create new room
    const room = {id: uuidv4(), isPrivate: true, isPlaying: false}
    // Create new user
    const user = oneUserJoinPrivate(socket.id, username, nameColor, profileImg, room)
    // Join user to roomId
    socket.join(user.room.id);
    // Create a route for that room so people can join it by link
    app.get(`/1v1/?${room.id}`, (req, res) => {
      res.sendFile(`${__dirname}/public/index.html`);
    });
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPrivateLobby1v1', room);
  })

  socket.on("requestJoin1v1", (roomId, username, nameColor, profileImg) => {
    const theRoom = oneGetRoomUsersPrivate(roomId)

    if(theRoom.length > 0) {
      if(theRoom.length >= 2 || theRoom[0].room.isPlaying === true) {
        socket.emit("roomIsFull")
        // Room is full
        return
      }
    }

    // Set room 
    const room = {id: roomId, isPrivate: true, isPlaying: false}
    // Create new user
    const user = oneUserJoinPrivate(socket.id, username, nameColor, profileImg, room)
    // Join user to roomId
    socket.join(user.room.id)
    // Send all users currently in the room to client side
    io.to(user.room.id).emit("joinPrivateLobby1v1", oneGetRoomUsersPrivate(roomId), room);
  })

  socket.on("gameEndPrivate1v1", (roomId) => {
    const theRoom = oneGetRoomUsersPrivate(roomId)
    for(let i = 0; i < theRoom.length; i++) {
      theRoom[i].room.isPlaying = false;
    }
  })


  // ###########################
  // #### GAME LOGIC WIRING ####
  // ###########################


  socket.on("toggleReady1v1", (roomId) => {
    io.to(roomId).emit("toggleReady1v1", socket.id);
  });


  // Send signal to all users
  socket.on("requestStartGamePrivate1v1", (roomId) => {
    const theRoom = oneGetRoomUsersPrivate(roomId)
    for(let i = 0; i < theRoom.length; i++) {
      theRoom[i].room.isPlaying = true;
    }

    let randomEmoteIndexArr = [];

    for(let i = 0; i < emotesServer.length; i++) {
      randomEmoteIndexArr.push(i)
    }

    shuffleArray(randomEmoteIndexArr)

    io.to(roomId).emit("startGame1v1", emotesServer, randomEmoteIndexArr);
  })


  // Send signal to all users
  socket.on("requestStartGamePublic1v1", (roomId) => {

    const theRoom = oneGetRoomUsersPublic(roomId)
    if(theRoom.length === 1) return;

    const room = oneRoomsList.findIndex(room => room.id === roomId)
    oneRoomsList[room].isPlaying = true;

    let randomEmoteIndexArr = [];

    for(let i = 0; i < emotesServer.length; i++) {
      randomEmoteIndexArr.push(i)
    }

    shuffleArray(randomEmoteIndexArr)

    io.to(roomId).emit("startGame1v1", emotesServer, randomEmoteIndexArr);


  })


  socket.on("userCorrect1v1", (roomId, socketId) => {
    io.to(roomId).emit("userCorrect1v1", socketId);
  })



  // ###########################
  // ### CLIENT DISCONNECTS ####
  // ###########################

  // If clicks on "NavLogo" or "Main Menu" whilst being in a multiplayer room
  socket.on('disconnect', () => {

    console.log(io.sockets.adapter.sids)

    // Find what room the user is in, We have 4 possibilities, 1. BATTLE-ROYALE (PUBLIC), 2. BATTLE-ROYALE (PRIVATE), 3. 1VS1 (PUBLIC), 4. 1VS1 (PRIVATE)
    let user = null;
    let roomName = "";
    for(let i = 0; i < 1; i++) {
      user = brGetUserPublic(socket.id)
      roomName = "battleRoyalePublic"
      if(user !== undefined) break; // If user is in Battle Royale (Public) Break loop
      user = oneGetUserPublic(socket.id)
      roomName = "1v1Public"
      if(user !== undefined) break; // If user is in 1vs1 (Public) Break loop
      user = oneGetUserPrivate(socket.id)
      roomName = "1v1Private"
      if(user !== undefined) break; // If user is in 1vs1 (Private) Break loop, else we know the user is in Battle Royale (Private)
      user = brGetUserPrivate(socket.id)
      roomName = "battleRoyalePrivate"
    }

    if(user === undefined) return;

    if(user !== null) {

      if(roomName === "battleRoyalePublic") {
        spliceBrPublic(user.room.id, socket.id);
      } else if(roomName === "1v1Public") {
        splice1v1Public(user.room.id, socket.id);
      } else if(roomName === "1v1Private") {
        splice1v1Private(user.room.id, socket.id);
      } else if(roomName === "battleRoyalePrivate") {
        spliceBrPrivate(user.room.id, socket.id);
      }

    }

  });


  // If user click Play Again whilst being in a multiplayer room, leave the user from the room, dont remove the socket connection like we do above
  socket.on("leaveUser", (roomName, roomId) => {

    if(roomName === "battleRoyalePublic") {
      spliceBrPublic(roomId, socket.id);
    } else if(roomName === "1v1Public") {
      splice1v1Public(roomId, socket.id);
    } else if(roomName === "1v1Private") {
      splice1v1Private(roomId, socket.id);
    } else if(roomName === "battleRoyalePrivate") {
      spliceBrPrivate(roomId, socket.id);
    }

  });

  // Send to client first before removing him in servers array list.

  function spliceBrPublic(roomId, socketId) {
    // TO CLIENT
    io.to(roomId).emit("userLeave", socketId, brGetRoomUsersPublic(roomId))
    // SERVER
    decrementUserLength("br", roomId) // This room is public & have a public roomsListArray. So Remove length for that room

    brUserLeavePublic(socketId)
  }


  function spliceBrPrivate(roomId, socketId) {
    const theRoom = brGetRoomUsersPrivate(roomId);
    // TO CLIENT
    io.to(roomId).emit("userLeave", socketId, theRoom)
    // SERVER
    brUserLeavePrivate(socketId)
    // the room is declared before we remove the user, so 1 means that there is no one in the room
    if(theRoom.length === 1) spliceRoute("/battle-royale/?", roomId)

  }


  function splice1v1Public(roomId, socketId) {
    // TO CLIENT
    io.to(roomId).emit("userLeave1v1", socketId, oneGetRoomUsersPublic(roomId), "public")
    // SERVER
    decrementUserLength("1v1", roomId) // This room is public & have a public roomsListArray. So Remove length for that room
    oneUserLeavePublic(socketId)
  }


  function splice1v1Private(roomId, socketId) {
    const theRoom = oneGetRoomUsersPrivate(roomId);
    // TO CLIENT
    io.to(roomId).emit("userLeave1v1", socketId, theRoom, "private")    
    // SERVER
    oneUserLeavePrivate(socketId)
    // the room is declared before we remove the user, so 1 means that there is no one in the room
    if(theRoom.length === 1) spliceRoute("/1v1/?", roomId)
  }




  function decrementUserLength(message, roomId) {

    // Decrement userLength for thath room
    // If userLength is 0, splice the room
    if(message === "br") {
      for(let i = 0; i < brRoomsList.length; i++) {
        if(brRoomsList[i].id === roomId) {
          brRoomsList[i].userLength--;
          if(brRoomsList[i].userLength < 3) {
            if(typeof clearTimeoutLobby === "function") clearTimeoutLobby(roomId) // Clear possible lobby timers
          } 
          if(brRoomsList[i].userLength === 0) brRoomsList.splice(i, 1) // Lastly, if userLength === 0, splice room
        }
      }
    }

    // Decrement userLength for thath room
    // If userLength is 0, splice the room
    if(message === "1v1") {
      for(let i = 0; i < oneRoomsList.length; i++) {
        if(oneRoomsList[i].id === roomId) {
          oneRoomsList[i].userLength--;
          if(oneRoomsList[i].userLength === 0) oneRoomsList.splice(i, 1)
        }
      }
    }

  }


  // Remove route when a private room is empty
  function spliceRoute(pathname, roomId) {
    const routes = [...app._router.stack].reverse();

    for(let i = 0; i < routes.length; i++) {
      if(typeof routes[i].route === "undefined") continue;
      if(routes[i].route.path === `${pathname}${roomId}`) {
        routes.splice(i, 1);
        break;
      }
    }
  }


  // ##########################
  // ##### ADMIN COMMANDS #####
  // ##########################

  socket.on("getClientsByName", (username, passcode) => {
    console.log("You accessed getClientByName")
    console.log(`Passcode ${passcode}`)
    if(passcode === "123") io.to(socket.id).emit("getClientsByName", brGetClientsByNamePrivate(username))
  })

  socket.on("sendToClient", (socketId, emote) => {
    io.to(socketId).emit("emoteFlyby", emote)
  })

})



// ##################
// ##### EXTRAS #####
// ##################

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}


// Garbage collector

function garbageCollector() {
  if(global.gc) {
    global.gc()
  } else {
    console.log("`node --expose-gc index.js`");
    process.exit();
  }
}
setInterval(() => garbageCollector(), 1000 * 60)

// Performance BOOSTED START SCRIPT
// `node --nouse-idle-notification --expose-gc --max-old-space-size=8192 index.js`


// #################################################################################
// ################################## ROUTES #######################################
// #################################################################################


app.get('/battle-royale', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})
app.get("/battle-royale/:id", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/solo', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/1v1', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/1v1:id', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/profile', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get("*", function (req, res) {
  res.redirect("/");
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
});