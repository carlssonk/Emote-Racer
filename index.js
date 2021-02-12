const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 8080;
const axios = require("axios")
const io = require("socket.io")(server);
const fs = require('fs');
const schedule = require("node-schedule");
const { v4: uuidv4 } = require('uuid');
const {
  // Battle Royale Private
  brUserJoinPrivate,
  brGetUserPrivate,
  brUserLeavePrivate,
  brGetRoomUsersPrivate,

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
// let reqStreamerData = require("./utils/data");
// console.log(reqStreamerData.length)
const emotesServer = require("./utils/emotes");
const { Socket } = require("dgram");


app.use(express.static(`${__dirname}/public`));



// #################################################################################
// ################################# CONFIGURATION #################################
// #################################################################################


const clientId = "qblw5u06par9cbf6ba5a3p0d5v0rjt";
const clientSecret = "md9kdwjidh5wf5f1t7lejq6xbkhfuj";
const token = "gt9v7snpiau3mymnnujobxw9bjex7c";

// USE THIS FUNCTION TO GENERATE A NEW TOKEN
async function generateToken() {
  try {
    // const res = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`)
    // const token = res.data.access_token;
  } catch(err) {
    console.error("ERROR!", err)
  }
}


// #################################################################################
// ##################################### DATA ######################################
// #################################################################################


const Streamers = [
  "Ninja",
  "Tfue",
  "shroud",
  "Myth",
  "pokimane",
  "xQcOW",
  "sodapoppin",
  "summit1g",
  "NICKMERCS",
  "TimTheTatman",
  "loltyler1",
  "Symfuhny",
  "LIRIK",
  "Anomaly",
  "Asmongold",
  "Mizkif",
  "HasanAbi",
  "ludwig",
  "moistcr1tikal",
  "MitchJones",
  "Nmplol",
  "jakenbakeLIVE",
  "Maya",
  "pokelawls",
  "ItsSliker",
  "EsfandTV",
  "erobb221",
  "forsen",
  "Trainwreckstv",
  "greekgodx",
  "auronplay",
  "Rubius",
  "DrLupo",
  "lilypichu",
  "adeptthebest",
  "TSM_Daequan",
  "cloakzy",
  "Sykkuno",
  "dakotaz",
  "Fresh",
  "Nightblue3",
  "NymN",
]

const emoteOfTheDay = [
  "425618",
  "30259",
  "41",
  "555555584",
  "120232",
  "25",
  "555555560",
  "58765",
  "1",
  "1035663",
  "64138",
  "304486301",
  "28087",
  "102242",
  "52",
  "555555589",
  "425618",
  "1035667",
  "301361407",
  "305362992",
  "684863",
  "302334335",
  "354",
  "123171",
  "114836",
  "354",
  "116245",
  "304412445",
  "521050",
  "715076",
  "186328",
  "301928407",
  "117611",
  "1678560",
  "127061",
  "1207074",
  "303257423",
  "205480",
  "1559681",
  "300502466",
  "305240043",
  "1949677",
  "301662923",
  "305146558",
  "106925",
  "125258",
  "303371795",
  "303607079",
  "303607079",
  "305288398",
  "300290082",
  "507931",
  "38924",
  "303119089",
  "304507322",
  "303706436",
  "1646084",
  "1722086",
  "305260555",
  "300183302",
  "1166070",
  "301874915",
  "301611970",
  "302341644",
  "304133743",
  "301120167",
  "301613366",
  "300272604",
  "301229116",
]

const StreamerDataBackend = [];

function returnStreamersList() {
  let streamersList = "";
  for(let user of Streamers) {
    streamersList += `&login=${user}`
  }
  return streamersList
}

// Get StreamerId & StreamerProfileImg
const getStreamerData = async () => {
  try {
    const config = {
      headers:{
        "Authorization": `Bearer ${token}`,
        "Client-Id": clientId
      }
    }
    const res = await axios.get(`https://api.twitch.tv/helix/users?login=Knut${returnStreamersList()}`, config)
    for(let userData of res.data.data) {
      StreamerDataBackend.push({name: userData.display_name, id: userData.id, img: userData.profile_image_url})
    }
    getStreamerEmotes()

  } catch(err) {
    console.error("ERROR!", err)
  }
}

// Get streamers emotes
const getStreamerEmotes = async () => {

const timer = ms => new Promise(res => setTimeout(res, ms)) // Returns a Promise that resolves after "ms" Milliseconds

async function fetchEmotes () { // We need to wrap the loop into an async function so we can pause loop for 1 second every fetch
  for (var i = 0; i < StreamerDataBackend.length; i++) {
    // Fetch data and add to StreamerDataBackedn array
    await axios.get(`https://api.twitchemotes.com/api/v4/channels/${StreamerDataBackend[i].id}`)
    .then(res => {
      StreamerDataBackend[i].emotes = res.data.emotes
    })
    .catch(err => {
      console.log("Oh no, we got an error: " + err)
    })

    await timer(1000); // Run loop every second
    console.log("Fetch " + i)
  }
  console.log("GO!")
  console.log(StreamerDataBackend)
  writeDataFile() // Run this script when loop is done
}

fetchEmotes(); // Start loop
}

// Rewrite data.js so we know everything is up to date
const writeDataFile = () => {
  fs.writeFileSync(`${__dirname}\\public\\js/data.js`, `var StreamerData = ${JSON.stringify(StreamerDataBackend)}`);

  fs.writeFileSync(`./utils/data`, `var StreamerData = ${JSON.stringify(StreamerDataBackend)} \n\n module.exports = StreamerData`);
  reqStreamerData = require("./utils/data");
}

// Update data.js file once every 24 hours
setInterval(function() {
  getStreamerData()
}, 1000 * 60 * 60 * 24)


// #################################################################################
// ############################### SOCKET IO #######################################
// #################################################################################


// Array that contains ALL rooms, the only reason we use this list is so we can loop over rooms and find one that a user joins when he is searching for a public br game,
// hence we dont need array of romms in private mode cuz we dont need to loop over rooms to find one.
let brRoomsList = [];
let oneRoomsList = [];
let lobbyCountdownTimers = [];

// setInterval(function() {
//   console.log(brRoomsList)
// }, 1000)


io.on("connection", (socket) => {

  // Send socketId to client
  socket.emit("socketId", socket.id)


  // ########################################
  // #### BATTLE ROYALE PUBLIC HANDLING #####
  // ########################################

  socket.on("quickPlay", (username) => {

    // Check if there are any available empty slots in rooms
    console.log(brRoomsList)
    if(brRoomsList.some(e => e.userLength < 12) && brRoomsList.some(e => e.isPlaying === false)) {
      // Sort rooms from high to low
      const roomsDescending = brRoomsList.sort((a, b) => b.userLength - a.userLength);
      // Loop through the array until we find an empty spot
      console.log("search rooms")
      for(let room of roomsDescending) {
        if(room.userLength < 12 && room.isPlaying === false) {
          room.userLength++;
          joinRoom(room.id, room.userLength);
          // Set timer
          // handleLobbyTimer(room.id, room.userLength, socket.id)
          break;
        }
      }
    } else {
      console.log("create new room")
      createNewRoom();
    }


    function joinRoom(roomId, userLength) {
      // Set room
      const room = {id: roomId, isPrivate: false}
      // Create new user
      const user = brUserJoinPublic(socket.id, username, room)
      // Join user to roomId
      socket.join(user.room.id)
      // Send all users currently in the room to client side
      io.to(user.room.id).emit("joinLobby", brGetRoomUsersPublic(user.room.id), room.id); // True statement refers to that this is a public lobby
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
    const user = brUserJoinPublic(socket.id, username, room)
    // Set Public Room
    brRoomsList.push({id: room.id, isPrivate: false, isPlaying: false, userLength: 1})
    // Join user to roomId
    socket.join(user.room.id);
    // Send room to client so it can generate a link for other people to join
    socket.emit('initLobby', room);
    }

  })

  // // So game start automatically if lobby is not full
  // socket.on("startLobbyTimer", (roomId, usersLength, socketId) => {
  //   handleLobbyTimer(roomId, usersLength, socketId)

  // })


  function startLobbyTimer(roomId) {

    this.clearTimeoutLobby = function(roomId) {

      for(let i = 0; i < lobbyCountdownTimers.length; i++) {
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


  // function handleLobbyTimer(roomId, usersLength, socketId) {
  //   if(usersLength >= 2) {
  //     io.to(socket.id).emit("startTimer", count)
  //   }

  //   function timer() {
  //     // Timer logic
  //     let count = 60;
  //     let counter = setInterval(() => initLobbyTimer(), 1000); //10 will  run it every 100th of a second
  //     function initLobbyTimer() {
  //       count--;
  //       if(count <= 0) {
  //         clearInterval(counter)
  //         return;
  //       } 
  //     }
  //   }

  // }
  // socket.on("stopLobbyTimer", (roomId, usersLength) => {
  //   console.log(roomId)
  //   console.log(usersLength)
  // })

  // ########################################
  // #### BATTLE ROYALE PRIVATE HANDLING ####
  // ########################################

  socket.on("createPrivateLobby", (username) => {
    // Create new room
    const room = {id: uuidv4(), isPrivate: true, isPlaying: false}
    // Create new user
    const user = brUserJoinPrivate(socket.id, username, room)
    // Join user to roomId
    socket.join(user.room.id);
    // Create a route for that room so people can join it by link
    app.get(`/battle-royale/?${room.id}`, (req, res) => {
      res.sendFile(`${__dirname}/public/index.html`);
    });
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPrivateLobby', room);
  })

  socket.on("requestJoin", (roomId, username) => {
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
    const user = brUserJoinPrivate(socket.id, username, room)
    // Join user to roomId
    socket.join(user.room.id)
    // Send all users currently in the room to client side
    io.to(user.room.id).emit("joinLobby", brGetRoomUsersPrivate(roomId), roomId);
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

    io.to(roomId).emit("startGame", emotesServer, randomEmoteIndex, brGetRoomUsersPrivate(roomId));
  })

  // // Send signal to all users
  // socket.on("requestStartGamePublic", (roomId) => {
  //   requestStartGamePublic(roomId);
  // });

  function requestStartGamePublic(roomId) {
    clearTimeoutLobby(roomId); // Clear lobby timer since we are now gonna start game

    const theRoom = brGetRoomUsersPublic(roomId)
    if(theRoom.length === 1) return;

    const room = brRoomsList.findIndex(room => room.id === roomId)
    brRoomsList[room].isPlaying = true;

    const randomEmoteIndex = Math.floor(Math.random() * emotesServer.length);

    io.to(roomId).emit("startGame", emotesServer, randomEmoteIndex, brGetRoomUsersPublic(roomId));
  }



  socket.on("requestNextRound", (roomId, localEmotes) => {
    const randomEmoteIndex = Math.floor(Math.random() * localEmotes.length);
    io.to(roomId).emit("nextRound", randomEmoteIndex);
  });

  
  socket.on("userCorrect", (roomId, socketId, image) => {
    io.to(roomId).emit("userCorrect", socketId, image);
  })
  socket.on("userWrong", (roomId, socketId) => {
    console.log("USER WRONG")
    io.to(roomId).emit("userWrong", socketId);
  })
  socket.on("userEliminated", (roomId, socketId, image) => {
    io.to(roomId).emit("userEliminated", socketId, image);
  })


  // ########################################
  // ####### 1 VS 1 PUBLIC HANDLING #########
  // ########################################

  socket.on("quickPlay1v1", (username, image) => {

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
      console.log("create new room")
      createNewRoom();
    }

    function joinRoom(roomId) {
      // Set room
      const room = {id: roomId, isPrivate: false}
      // Create new user
      const user = oneUserJoinPublic(socket.id, username, image, room)
      // Join user to roomId
      socket.join(user.room.id)
      // Send all users currently in the room to client side
      io.to(user.room.id).emit("joinPublicLobby1v1", oneGetRoomUsersPublic(user.room.id), room); // True statement refers to that this is a public lobby
    }

    function createNewRoom() {
    // Create new room
    const room = {id: uuidv4(), isPrivate: false}
    // Create new user
    const user = oneUserJoinPublic(socket.id, username, image, room)
    // Set Public Room
    oneRoomsList.push({id: room.id, isPrivate: false, isPlaying: false, userLength: 1})
    // Join user to roomId
    console.log(user)
    console.log(user.room)
    socket.join(user.room.id);
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPublicLobby1v1', room);
    }

  })


  // ########################################
  // ####### 1 VS 1 PRIVATE HANDLING ########
  // ########################################

  socket.on("createPrivateLobby1v1", (username, image) => {
    // Create new room
    const room = {id: uuidv4(), isPrivate: true, isPlaying: false}
    // Create new user
    const user = oneUserJoinPrivate(socket.id, username, image, room)
    // Join user to roomId
    socket.join(user.room.id);
    // Create a route for that room so people can join it by link
    app.get(`/1v1/?${room.id}`, (req, res) => {
      res.sendFile(`${__dirname}/public/index.html`);
    });
    // Send room to client so it can generate a link for other people to join
    socket.emit('initPrivateLobby1v1', room);
  })

  socket.on("requestJoin1v1", (roomId, username, image) => {
    console.log("-------------")
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
    const user = oneUserJoinPrivate(socket.id, username, image, room)
    // Join user to roomId
    socket.join(user.room.id)
    // Send all users currently in the room to client side
    io.to(user.room.id).emit("joinPrivateLobby1v1", oneGetRoomUsersPrivate(roomId));
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
    console.log(roomId)
    console.log("TOGGLE READYT")
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
    // console.log("REQUEST PUBLIX")
    // requestStartGamePublic1v1(roomId);

    const theRoom = oneGetRoomUsersPublic(roomId)
    if(theRoom.length === 1) return;

    const room = oneRoomsList.findIndex(room => room.id === roomId)
    oneRoomsList[room].isPlaying = true;
    console.log(oneRoomsList)
    console.log("is it TRUE?!")

    let randomEmoteIndexArr = [];

    for(let i = 0; i < emotesServer.length; i++) {
      randomEmoteIndexArr.push(i)
    }

    shuffleArray(randomEmoteIndexArr)

    io.to(roomId).emit("startGame1v1", emotesServer, randomEmoteIndexArr);


  })

  // function requestStartGamePublic1v1(roomId) {

  // }



  socket.on("userCorrect1v1", (roomId, socketId) => {
    // console.log(socketId)
    io.to(roomId).emit("userCorrect1v1", socketId);
  })






  // oneUserJoinPrivate,
  // oneGetUserPrivate,
  // oneUserLeavePrivate,
  // oneGetRoomUsersPrivate,

  // ###########################
  // ### CLIENT DISCONNECTS ####
  // ###########################

  socket.on('disconnect', () => {
    // FIND WHAT ROOM THE USER WAS IN, WE HAVE 4 POSSIBILITIES, 1. BATTLE-ROYALE (PUBLIC), 2. BATTLE-ROYALE (PRIVATE), 3. 1VS1 (PUBLIC), 4. 1VS1 (PRIVATE)
    let user;
    let userRoom = "";
    for(let i = 0; i < 1; i++) {
      user = brGetUserPublic(socket.id)
      userRoom = "brGetUserPublic"
      if(user !== undefined) break;
      user = oneGetUserPublic(socket.id)
      userRoom = "oneGetUserPublic"
      if(user !== undefined) break;
      user = oneGetUserPrivate(socket.id)
      userRoom = "oneGetUserPrivate"
      if(user !== undefined) break;
      user = brGetUserPrivate(socket.id)
      userRoom = "brGetUserPrivate"
    }
    
    if(user !== undefined) {

      // If user was in a public room, remove user count in that room
      if(user.room.isPrivate === false && userRoom === "brGetUserPublic") {
        for(let i = 0; i < brRoomsList; i++) {
          if(brRoomsList[i].id === user.room.id) {
            brRoomsList[i].userLength--;
            if(brRoomsList[i].userLength === 0) brRoomsList.splice(i, 1)
          } 
        }
      } else if(user.room.isPrivate === false && userRoom === "oneGetUserPublic") {
        for(let i = 0; i < oneRoomsList; i++) {
          if(oneRoomsList[i].id === user.room.id) {
            oneRoomsList[i].userLength--;
            if(oneRoomsList[i].userLength === 0) oneRoomsList.splice(i, 1)
          }
        }
      }

      if(userRoom === "brGetUserPublic") {
        io.to(user.room.id).emit("userLeave", socket.id, brGetRoomUsersPublic(user.room.id))
        brUserLeavePublic(socket.id)
      } else if(userRoom === "oneGetUserPublic") {
        io.to(user.room.id).emit("userLeave1v1", socket.id, oneGetRoomUsersPublic(user.room.id), "public")
        oneUserLeavePublic(socket.id)
      } else if(userRoom === "oneGetUserPrivate") {
        io.to(user.room.id).emit("userLeave1v1", socket.id, oneGetRoomUsersPrivate(user.room.id), "private")
        oneUserLeavePrivate(socket.id)
      } else if(userRoom === "brGetUserPrivate") {
        io.to(user.room.id).emit("userLeave", socket.id, brGetRoomUsersPrivate(user.room.id))
        brUserLeavePrivate(socket.id)
      }

    }

 });


  // ##########################
  // ##### ADMIN COMMANDS #####
  // ##########################

  socket.on("getClientByName", (passcode) => {
    console.log("You accessed getClientByName")
    console.log(`Passcode ${passcode}`)
  })

})




// EXTRAS

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}


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
// app.get("*", function (req, res) {
//   res.redirect("/");
// });

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
});