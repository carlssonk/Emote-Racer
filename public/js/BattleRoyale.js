// DOM
const playerAsideContainer = document.querySelector(".player-aside-container");
const playerEliminatedContainer = document.querySelector(".player-aside-eliminated-container")

// Initialize Web Workers, we use this to keep (timers) everyone up to date with the game flow.
let myWorker = null;
if(window.Worker) {
  myWorker = new Worker("/js/worker.js")
}


// Temporary username and profileImg
let username = setUsername();
let profileImg = "1";


// Socket/Room config
let socketId = "";
let roomId = location.search.substring(1);



let socket;
initSocket = function() {
  return socket = io();
}

function initBattleRoyale(mode) {
  // Initialize socket conneciton
  initSocket();

  // Socket/Room config
  let socketId = "";
  // Game data
  let localUsers = [];
  let localEmotes = [];
  let localRandomEmoteIndex = 0;
  let currentEmote = {};
  let gameEnded = false;
  let playerQualifiedCount = 0;


  // Set local socketId
  socket.on("socketId", (id) => {
    socketId = id;
  });

  // Quickplay or Private lobby with friends
  if(mode === "public") socket.emit("quickPlay", username);
  if(mode === "private") socket.emit("createPrivateLobby", username);

  // Request join room by url
  if(mode === "joinByLink") socket.emit("requestJoin", roomId, username);

  socket.on("roomIsFull", () => {
    mainPage();
    // Send message to user that room is full
    const roomIsFullLabel = document.querySelector(".room-is-full-label")
    roomIsFullLabel.style.display = "block";
    roomIsFullLabel.style.opacity = "1";
    setTimeout(() => roomIsFullLabel.style.marginTop = "-100px", 50)
    setTimeout(function() {
      roomIsFullLabel.style.opacity = "0";
    }, 700)
    setTimeout(function() {
      roomIsFullLabel.style.display = "none";
      roomIsFullLabel.style.marginTop = "0";
    }, 1700)
  }) 

  // Create and join unique PUBLIC room
  socket.on("initLobby", (room) => {
    // Join lobby room
    lobbyRoom("public")
    // Add start button
    // const startGameBtnContainer = document.querySelector(".start-game-btn-container")
    // startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
    // const startGameBtn = document.querySelector(".start-game-btn")
    // startGameBtn.addEventListener("click", brStartGame)
    roomId = room.id;
  });

  // Create and join unique room
  socket.on("initPrivateLobby", (room) => {
    // Join lobby room
    lobbyRoom(room.id)
    // Add start button
    const startGameBtnContainer = document.querySelector(".start-game-btn-container")
    startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
    const startGameBtn = document.querySelector(".start-game-btn")
    startGameBtn.addEventListener("click", brStartGame)
  });

  // Update lobby when player joins
  socket.on("joinLobby", (users, room) => {
    if(main.dataset.page === "battle-royale") return;
    // LOBBY DOM
    const lobbyPlayer = document.querySelectorAll(".lobby-player")
    const playerName = document.querySelectorAll(".player-name")
    const playerLobbyImg = document.querySelectorAll(".player-lobby-img")
    // Set user name and image when players join
    console.log(playerName)
    for(let i = 0; i < users.length; i++) {
      playerName[i].innerText = users[i].username
      playerLobbyImg[i].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
      lobbyPlayer[i].classList.add("fade-scale-animation")
    }

    if(users.length > 1) {
      if(socketId === users[0].id && users[0].room.isPrivate === true) {
      // Add start button
      const startGameBtnContainer = document.querySelector(".start-game-btn-container")
      startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
      const startGameBtn = document.querySelector(".start-game-btn")
      startGameBtn.addEventListener("click", brStartGame)
      }
    }

    roomId = room

    if(users[0].room.isPrivate === true) {
      main.dataset.isPrivate = "true"
    } else {
      main.dataset.isPrivate = "false"
    }
    
  });

  socket.on("startTimer", () => {
    lobbyTimer();
  })

  function lobbyTimer() {
    let count = 5;
    let counter = setInterval(() => initLobbyTimer(), 1000); //10 will  run it every 100th of a second
    function initLobbyTimer() {
      count--;
      if(count <= 0) {
        console.log("START GAME")
        socket.emit("requestStartGamePublic", roomId)
        clearInterval(counter)
        return;
      } 
    }
  }

  // User Leave
  socket.on("userLeave", (userSocketId, users) => {

    // ###########################
    // PLAYER LEAVES IN LOBBY ROOM
    // ###########################

    if(main.dataset.page === "lobby-room") {
      
      // LOBBY DOM
      const lobbyPlayer = document.querySelectorAll(".lobby-player")
      const playerName = document.querySelectorAll(".player-name")
      const playerLobbyImg = document.querySelectorAll(".player-lobby-img")

      // Find index in users array
      const index = users.findIndex(e => e.id === userSocketId);

      // Remove img and name for last position
      playerName[users.length - 1].innerText = "";
      playerLobbyImg[users.length - 1].src = "";
      lobbyPlayer[users.length - 1].classList.remove("fade-scale-animation")

      // Remove index from array
      // -1 means "findIndex method" did not find matching
      if(index !== -1) {
        users.splice(index, 1)
      }

      // If not last person in array left, set new positions
      if(index !== users.length) {
        for(let i = 0; i < users.length; i++) {
          playerName[i].innerText = users[i].username
          playerLobbyImg[i].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
        }
      }

      // If first user left, i.e. lobby leader, set new play button for new leader
      if(index === 0)  {
        if(socketId === users[0].id && users[0].room.isPrivate === true && users.length > 1) {
        const startGameBtnContainer = document.querySelector(".start-game-btn-container")
        startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
        const startGameBtn = document.querySelector(".start-game-btn")
        startGameBtn.addEventListener("click", brStartGame)
        }
      }

    }

    // ##############################
    // PLAYER LEAVES IN BATTLE ROYALE
    // ##############################

    if(main.dataset.page === "battle-royale") {
      // Find index in users array
      const index = localUsers.findIndex(e => e.id === userSocketId);
      
      const playerAside = document.querySelectorAll(".player-aside")
      const playerQualified = document.querySelectorAll(".player-qualified")
      const playerQualifiedImg = document.querySelectorAll(".player-qualified-img")


      // Remove user from Aside
      for(let player of playerAside) {
        if(player.dataset.id === userSocketId) {
          player.dataset.disconnected = "true";
          player.style.opacity = "0.2"
          player.style.backgroundColor ="rgb(53, 53, 53)";
        } 
      }

      // Remove user from Qualified if he was qualified and then left
      // First check if game is has not ended
      if(gameEnded === false) {
        for(i = 0; i < playerQualified.length; i++) {
          if(playerQualified[i].dataset.id === userSocketId) {
            playerQualifiedCount--;
            playerQualified[i].dataset.id = "";
            playerQualifiedImg[i].src = "";
            playerQualifiedImg[i].classList.remove("fade-scale-animation")
          }
        }
      }

      
      // Remove index from array
      // -1 means "findIndex method" did not find matching
      if(index !== -1) {
        localUsers.splice(index, 1)
      }

      // Set length of players remaining
      const playersRemaining = document.querySelector("#players-remaining")
      const hasNotQualified = localUsers.filter(e => e.hasQualified === false)
      if(gameEnded !== true) playersRemaining.innerText = hasNotQualified.length;

      if(localUsers.length === 1 && gameEnded === false && typeof forceWin === "function") forceWin();
      if(localUsers.length === 1 && typeof stopProgressBar === "function") setTimeout(() => stopProgressBar(), 50);

    }

  });



  // Listen for Lobby leader to start game
  this.brStartGame = function() {
    socket.emit("requestStartGame", roomId)
  }

  socket.on("startGame", (emotesServer, randomEmoteIndex, users) => {
    gameEnded = false;
    playerQualifiedCount = 0;
    
    localEmotes = emotesServer;
    localRandomEmoteIndex = randomEmoteIndex;
    localUsers = users;
    loadBattleRoyale();
  });


  function loadBattleRoyale() {
  // CONFIG
  main.dataset.page = "battle-royale"

  // GAME CONFIGURATION 
  let hasGuessed = false;
  let canStillQualify = false;
  let qualified = false;
  let lives = 3;
  let waitSubmit = true;
  
  let eliminated = false;
  let currentRound = 0;

  // Utils
  function resetGameSettings() {
    hasGuessed = false;
    canStillQualify = false;
    playerQualifiedCount = 0;
    qualified = false;
    lives = 3;
    waitSubmit = true;
    for(let user of localUsers) user.hasQualified = false;

    gameUpperContent.style.display = "none";

    currentEmote = localEmotes[localRandomEmoteIndex];
  }

  // GAME CONTAINER
  function battleRoyaleGameContainer() {

    // ############################
    // ####### SET ASIDE DOM ######
    // ############################

    playerAsideDOM();

    function playerAsideDOM() {
      // Players remaining label
      playersRemaining.innerText = localUsers.length;
      // Make sure eliminated container is empty
      playerEliminatedContainer.innerHTML = "";

      playerAsideHTML();
      // DOM
      playerHearts = document.querySelectorAll(".player-heart");
      playerAside = document.querySelectorAll(".player-aside");
      playerAsideName = document.querySelectorAll(".player-aside-name");
      playerAsideImg = document.querySelectorAll(".player-aside-img");
 
      const socketIndex = localUsers.findIndex(x => x.id === socketId);

      const otherPlayers = localUsers.filter(x => x.id !== socketId);

      // Set username & socketId to DOM
      playerAsideName[0].innerText = localUsers[socketIndex].username;
      playerAsideImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
      playerAside[0].dataset.id = socketId;
      playerAside[0].style.display = "flex";
      for(let i = 0; i < otherPlayers.length; i++) {
        playerAsideName[i+1].innerText = otherPlayers[i].username;
        playerAsideImg[i+1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
        playerAside[i+1].dataset.id = otherPlayers[i].id;
        playerAside[i+1].style.display = "flex";
      }

      battleRoyaleAside.style.display = "block";
    }

    function playerAsideHTML() {
      let playersAsideHtml = ``
      for(let user of localUsers) playersAsideHtml += `<li class="player-aside"><img class="player-aside-img" src="" alt=""><span class="player-aside-name"></span><span class="player-heart-container"><i class="fas fa-heart player-heart"></i><i class="fas fa-heart player-heart"></i><i class="fas fa-heart player-heart"></i></span></li>`
      return playerAsideContainer.innerHTML = playersAsideHtml
    }


    // ################################
    // ####### SET QUALIFIED DOM ######
    // ################################


    setPlayerQualified()

    function setPlayerQualified() {
      // const playersQualifiedContainer = document.querySelector(".players-qualified-container")
      playersQualifiedContainer.innerHTML = "";

      let ordinals = "";
      if(localUsers.length >= 6) {
        for(let i = 1; i < localUsers.length - 1; i++) {
          checkOrdinals(i)
          playersQualifiedContainer.innerHTML += `<div class="player-qualified" data-id=""><img class="player-qualified-img" src="" alt=""><div class="player-qualified-num">${i + ordinals}</div></div>`
        }
      } 
      if(localUsers.length > 1 && localUsers.length <= 5) {
        for(let i = 1; i < localUsers.length; i++) {
          checkOrdinals(i)
          playersQualifiedContainer.innerHTML += `<div class="player-qualified" data-id=""><img class="player-qualified-img" src="" alt=""><div class="player-qualified-num">${i + ordinals}</div></div>`
        }
      } 
      if(localUsers.length === 1) playersQualifiedContainer.innerHTML += `<div class="player-qualified" data-id=""><img class="player-qualified-img" src="" alt=""><div class="player-qualified-num">1st</div></div>`

      function checkOrdinals(num) {
        if(num === 1) ordinals = "st"
        if(num === 2) ordinals = "nd"
        if(num === 3) ordinals = "rd"
        if(num >= 4) ordinals = "th"
      }

      // Set DOM
      playerQualified = document.querySelectorAll(".player-qualified")
      playerQualifiedImg = document.querySelectorAll(".player-qualified-img")
    }


    // ################################
    // ####### HANDLE ROUND END #######
    // ################################


    function showCorrectAnswer() {
      inputEmote.readOnly = true;
      inputEmote.value = "";

      // Show Next Round Container
      nextRoundContainer.classList.remove("hide-fade");
      nextRoundContainer.style.display = "flex";
      nextRoundContainer.classList.add("show-fade");

      // Show the actual Box with content inside
      outputWaitNextRound.classList.add("show-fade-next")

      // Set the content that is inside "outputWaitNextRound"
      outputEmoteImg.src = emoteImg.src;
      outputCorrect.innerText = localEmotes[localRandomEmoteIndex].name;

      // Set "timer until next round"
      nextRoundTimer()
    }

    function nextRoundTimer() {
      // Remove socket listeners (AVOIDS DUPLICATE LISTENERS)
      socket.removeListener("userCorrect");
      socket.removeListener("userWrong");
      socket.removeListener("userEliminated");

      // If user leaves page by clicking on the navLogo we need to clear timer so we dont get any errors
      this.stopNextRoundTimer = function() {
        myWorker.postMessage("clearCountdown")
        clearInterval(counter);
      }

      // Start countdown timer in worker.js
      myWorker.postMessage("startCountdown")

      // Update countdown timer in worker.js on window.onfocus (i.e if user switches tab and comes back)
      window.onfocus = function() {
        if(main.dataset.page === "battle-royale") myWorker.postMessage("updateCountdown")
      };

      myWorker.onmessage = (e) => {
        if(e.data.name === "updateCountdown") {
          count = e.data.message
        }

        if(e.data === "stopCountdown") {
          stopTimerInitBattleRoyaleGame()
        }

      }

      function stopTimerInitBattleRoyaleGame() {
        clearInterval(counter);
        document.querySelector(".next-round-starting-in").innerHTML=count /10+ " ...";
        nextRoundContainer.classList.add("hide-fade");

        setTimeout(function() {
          if(eliminated === false) userOutputContainer.style.display = "none"
          nextRoundContainer.style.display = "none"
          outputWaitNextRound.classList.add("show-fade-next")
        }, 200)

        nextRound();
      }

      let count = 50;
      let counter = setInterval(() => initNextRoundTimer(), 100); //10 will  run it every 100th of a second
      function initNextRoundTimer() {
        if(count <= 0) return;
        count--;
        
        if(count%10 === 0) {
          nextRoundStartingIn.innerHTML=count /10+ ".0" + " ...";
        } else {
          nextRoundStartingIn.innerHTML=count /10+ " ...";
        }
      }
    }


    function nextRound() {
      // Set Player Qualified
      setPlayerQualified()

      // Reset hasQualified & hasGuessed for all users
      resetLocalUsersArray();

      // DOM RESET
      if(gameEnded === false) playersRemaining.innerText = localUsers.length;
      bar.style.width = "";
      for(let heart of playerHearts) heart.className = "fa-heart player-heart fas";
      for(let player of playerAside) {
        player.style.backgroundColor = "";
        player.style.marginBottom = "";
        player.classList.remove("hide-player-aside")
      } 

      // Remove socket listeners (TO AVOID DUPLICATE LISTENERS)
      socket.removeListener("userCorrect");
      socket.removeListener("userWrong");
      socket.removeListener("userEliminated");

      // Remove emote from array
      localEmotes.splice(localRandomEmoteIndex, 1)

      // Emit requestNextRound. Only 1 client need to make the request, we choose to set player[0] in array to send the emit message.
      if(socketId === localUsers[0].id) setTimeout(() => socket.emit("requestNextRound", roomId, localEmotes), 200)

    }

    socket.on("nextRound", randomEmoteIndex => {
      localRandomEmoteIndex = randomEmoteIndex;
      currentEmote = localEmotes[localRandomEmoteIndex];

      slideRightEmoteAnimation();
    });

    function slideRightEmoteAnimation() {
      gameUpperContent.classList.add("animate__backOutRight")

      setTimeout(() => {
        emoteName.innerText = "";
        emoteName.classList.remove("show-fade")
        gameUpperContent.classList.remove("animate__backOutRight")
        battleRoyaleGame(localRandomEmoteIndex)
      }, 500)
    }

    function resetLocalUsersArray() {
      for(let user of localUsers) {
        user.hasQualified = false;
        user.hasGuessed = false;
      }
    }

    // ####################################################################################################################################################################
    // ################################################# INITS GAME STATE #################################################################################################
    // ####################################################################################################################################################################

    function battleRoyaleGame() {
      resetGameSettings() // Game utils reset
      currentRound++; // Next round

      // Key Press Event listener 
      inputEmote.addEventListener("keypress", guessListener)


      // If users are AFK, kick them
      if(currentRound > 50) {
        socket.disconnect();
        mainPage();
      }

      // ###########################################################
      // ######################### TIMER ###########################
      // ###########################################################

      if(currentRound === 1) {
        battleRoyaleTimer();
      } else {
        initBattleRoyaleGame();
      }

      function battleRoyaleTimer() {
        // If user leaves page by clicking on the navLogo we need to clear timer so we dont get any errors
        this.stopInitTimer = function() {
          myWorker.postMessage("clearCountdown")
          clearInterval(counter);
        }

        // Start countdown timer in worker.js
        myWorker.postMessage("startCountdown")

        // Update countdown timer in worker.js on window.onfocus (i.e if user switches tab and comes back)
        window.onfocus = function() {
          if(main.dataset.page === "battle-royale") myWorker.postMessage("updateCountdown")
        };

        myWorker.onmessage = (e) => {
          if(e.data.name === "updateCountdown") {
            count = e.data.message
            // document.querySelector(".game-starting-in-time").innerHTML=count /10+ " ..."; 
          }

          if(e.data === "stopCountdown") {
            stopTimerInitBattleRoyaleGame()
          }

        }

        function stopTimerInitBattleRoyaleGame() {
          clearInterval(counter);
          document.querySelector(".game-starting-in-time").innerHTML=count /10+ " ...";
          gameStartingInContainer.classList.add("hide-fade");

          setTimeout(function() {
            gameStartingInContainer.style.display = "none"
          }, 200)

          initBattleRoyaleGame()
        }

      
        // Show timer
        gameStartingInContainer.classList.remove("hide-fade");
        gameStartingInContainer.style.display = ""
        
        let count = 50;
        let counter = setInterval(() => initBattleRoyaleTimer(), 100); //10 will  run it every 100th of a second
        function initBattleRoyaleTimer() {
          if(count <= 0) return;
          count--;

          if(count%10 === 0) {
            gameStartingIn.innerHTML=count /10+ ".0" + " ...";
          } else {
            gameStartingIn.innerHTML=count /10+ " ...";
          }
        }
      }


      // ##################################################
      // ################# INIT GAME ######################
      // ##################################################

      function initBattleRoyaleGame() {
        // Check if any user has left

        const initRound = () => {
          if(localUsers.length === 1 && typeof stopProgressBar === "function") setTimeout(() => stopProgressBar(), 50)

          if(!eliminated) inputEmote.readOnly = false;
          inputEmote.focus(); // Automatically focus input text

          if(currentEmote.provider === "twitch") emoteImg.src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmote.id}/4.0`
          if(currentEmote.provider === "bttv") emoteImg.src = `https://cdn.betterttv.net/emote/${currentEmote.id}/3x`
          if(currentEmote.provider === "ffz") emoteImg.src = `https://cdn.frankerfacez.com/emoticon/${currentEmote.id}/4`

          setTimeout(initRoundDOM, 400)
        }

        const initRoundDOM = () => {
          gameUpperContent.style.display = "block";
          gameUpperContent.classList.add("animate__backInLeft");
          setTimeout(() => waitSubmit = false, 200)
        }


        // ########################
        // #### TIME LEFT BAR #####
        // ########################
        let barPercentage = 400
        let barWidth = $(".bar").width()
        const counter = setInterval(() => progress(), 40); // update progress bar once every 30ms

        function progress() {
          const progressBarWidth = (barPercentage / 400) * barWidth
          $(".bar").animate({ width: Math.round(progressBarWidth) }, 0)

          if(barPercentage <= 0) {
            clearInterval(counter)
            return
          }
          barPercentage--
        };

        // If user leaves page by clicking on the navLogo we need to clear timer so we dont get any errors
        this.stopProgressBar = function() {
          myWorker.postMessage("clarProgressBar")
          clearInterval(counter);
        }

        // Workers
        myWorker.postMessage("startProgressBar")

        window.onfocus = function() {
          if(main.dataset.page === "battle-royale") myWorker.postMessage("updateProgressBar")
        };

        myWorker.onmessage = (e) => {
          if(e.data.name === "updateProgressBar") {
            barPercentage = e.data.message
          }
    
          if(e.data === "stopProgressBar") {
            handleEndRound();
          }
    
        }


        initRound()
      }


      // ########################
      // #### ENTER LISTENER ####
      // ########################


      function guessListener(e) {
        if(e.key === "Enter") {
          if(inputEmote.value === "") return;
          while(waitSubmit === true) {
            waitSubmitDom();
            return;
          } 

          const guess = inputEmote.value.toLowerCase();
          const emoteCode = currentEmote.name.toLowerCase();
          
          if(guess === emoteCode) {
            socket.emit("userCorrect", roomId, socketId, profileImg);
            handleRoundWin();
          } else {
            lives--
            wrongGuessAnimation();
            if(lives > 0) socket.emit("userWrong", roomId, socketId);
            if(lives <= 0) {
              socket.emit("userEliminated", roomId, socketId, profileImg);
              handleRoundLose();
            } 
          }
          inputEmote.value = "";
        }
      }

      function waitSubmitDom() {
        waitLabel.classList.remove("wait-label-fade")
        setTimeout(() => waitLabel.classList.add("wait-label-fade"), 50)
        setTimeout(() => waitLabel.classList.remove("wait-label-fade"), 850)
      }


      function playerAsideBackgroundColor(color, userSocketId, operator) {

        let playerDOM;

        // SET HIDE PLAYER ASIDE
        if(color === "green") {
          removePlayerAside(userSocketId);
        }

        // SET HIDE PLAYER ASIDE & MOVE HIM TO NOT ELIMINATED LIST
        if(color === "red") {
          removePlayerAsideEliminated(userSocketId);
        }

        // SET COLOR
        if(operator === "===") {
          for(let i = 0; i < playerAside.length; i++) if(playerAside[i].dataset.id === userSocketId) playerDOM = playerAside[i];
          playerDOM.style.backgroundColor = color
        }
        if(operator === "!==") {
          for(let i = 0; i < playerAside.length; i++) if(playerAside[i].dataset.id !== userSocketId) playerDOM = playerAside[i];
          playerDOM.style.backgroundColor = color
        }

        // SET TRANSITION
        playerDOM.style.transition = "400ms"
      }

      // Remove player aside (if user guesses correct)
      function removePlayerAside(userSocketId) {
        let playerRemoveMargin = null; // We need to remove margin for a player besides the player that got removed, so we dont get white-space between them
        for(let i = 0; i < playerAside.length; i++) {
          if(playerAside[i].dataset.id === userSocketId) {
            playerDOM = playerAside[i];
            if(i-1 >= 0) playerRemoveMargin = playerAside[i-1];
          } 
        }
        if(playerRemoveMargin !== null) playerRemoveMargin.style.marginBottom = "0";
        playerDOM.classList.add("hide-player-aside");
        addMarginBottomToLastPlayer();
      }

      function addMarginBottomToLastPlayer() {
        let isHiddenLength = 0;
        for(let player of playerAside) {
          if(player.classList.contains("hide-player-aside")) isHiddenLength++;
        }
        if(isHiddenLength === playerAside.length - 1) playerAside[0].style.marginBottom = "";
      }

      // Remove player aside & put him in eliminated aside list (if user guesses wrong)
      function removePlayerAsideEliminated(userSocketId) {
        removePlayerAside(userSocketId)

        // Find player that we will eliminate
        const eliminatedPlayers = localUsers.filter(e => e.id === userSocketId)
        // Add player to not qualified list
        // We set a timeout here because we want to wait for animation to finish before removing element completely
        setTimeout(() => {
          eliminatedPlayersDom(eliminatedPlayers)
          // Splice player from localUsers
          removeEliminatedPlayers(eliminatedPlayers)
        }, 400)
      }

      // ########################
      // #### SOCKET CORRECT ####
      // ########################
      socket.on("userCorrect", (userSocketId, image) => {
        // Set Qualified in localUsers
        const userIndex = localUsers.findIndex(e => e.id === userSocketId)
        localUsers[userIndex].hasQualified = true;
        // Set Qualified count
        playerQualifiedCount = localUsers.filter(e => { return e.hasQualified; }).length

        // Set DOM (Important to have this function first, some of the logic below is dependent on this)
        userCorrectDOM(userSocketId, image);

        // So we know WHO has guessed
        setUserGuessed(userSocketId);

        // So we knows WHO has qualified
        setUserQualified(userSocketId)

        // Check if any player has yellow background, if they have, set it to red.
        if(playerQualifiedCount <= 1) userYellowToRed();

        // Eliminate player that has guessed wrong WHEN the first player guesses right (because we dont want to eliminate the players if no one gets it right)
        setEliminateWrongGuess();

        // Set users remaining label
        usersRemaining();

        // If number of qualified positions is full.
        if(playerQualified.length === playerQualifiedCount) {
          handleEndRound(userSocketId);
          return
        }

        // If everyone has guessed, go next round
        if(localUsers.every(e => e.hasGuessed)) handleEndRound()
      
      });

      function userCorrectDOM(userSocketId, image) {
        // Aside
        playerAsideBackgroundColor("green", userSocketId, "===")

        // Qualified
        for(let i = 0; i < playerQualified.length; i++) {
          if(playerQualified[i].dataset.id === "") {
            playerQualified[i].dataset.id = userSocketId;
            playerQualifiedImg[i].src = `https://static-cdn.jtvnw.net/emoticons/v1/${image}/3.0`;
            playerQualifiedImg[i].classList.add("fade-scale-animation")
            break;
          }
        }
      }

      function setUserQualified(userSocketId) {
        const userIndex = localUsers.findIndex(e => e.id === userSocketId)
        localUsers[userIndex].hasQualified = true;
        if(socketId === userSocketId) {
          qualified = true;
          handleOutput("outputQualified")
        }
      }

      function setEliminateWrongGuess() {
        if(canStillQualify === true) {
          canStillQualify = false;
          handleOutput("outputEliminated")
        } 
      }

      function userYellowToRed() {
        for(let player of playerAside) {
          if(player.style.backgroundColor === "gold") {
            player.style.backgroundColor = "red";
            const userSocketId = player.dataset.id
            removePlayerAsideEliminated(userSocketId);
          } 
        }
      }


      // #############################
      // ####### SOCKET WRONG ########
      // #############################


      socket.on("userWrong", (userSocketId) => {
        removePlayerHeart(userSocketId)
      });


      // #############################
      // ##### SOCKET ELIMINATED #####
      // #############################


      socket.on("userEliminated", (userSocketId, image) => {
        const userIndex = localUsers.findIndex(e => e.id === userSocketId)
        localUsers[userIndex].hasQualified = false;

        // Set users remaining label
        usersRemaining();

        // So we know WHO has guessed
        setUserGuessed(userSocketId);

        // If no one has qualified, you can still qualify
        setCanQualifyWrongGuess(userSocketId);

        // Eliminate player
        setEliminatePlayer(userSocketId);

        // Remove a players heart
        removePlayerHeart(userSocketId);

        // Set users remaining label
        usersRemaining();

        // If everyone has guessed, go next round
        if(localUsers.every(e => e.hasGuessed)) handleEndRound()
      });

      function usersRemaining() {
        // Timeout 400ms because we splice users from localUsers after 400ms (i.e after animations of playersAside is done)
        setTimeout(function() {
          const hasNotQualified = localUsers.filter(e => e.hasQualified === false)
          if(hasNotQualified.length !== 0 && gameEnded === false) playersRemaining.innerText = hasNotQualified.length;
        }, 400)
      }

      function setCanQualifyWrongGuess(userSocketId) {
        if(playerQualifiedCount === 0) playerAsideBackgroundColor("gold", userSocketId, "===")

        if(playerQualifiedCount === 0 && socketId === userSocketId) {
          canStillQualify = true;
          handleOutput("outputCanStillQualify")
        }
      }


      function setUserGuessed(userSocketId) {
        const userIndex = localUsers.findIndex(e => e.id === userSocketId)
        localUsers[userIndex].hasGuessed = true;
        if(socketId === userSocketId) {
          hasGuessed = true;
        } 
      }

      function setEliminatePlayer(userSocketId) {
        if(playerQualifiedCount > 0) console.log("red")
        if(playerQualifiedCount > 0) playerAsideBackgroundColor("red", userSocketId, "===")
        if(playerQualifiedCount > 0 && socketId === userSocketId) {
          handleOutput("outputEliminated")
        }
      }

      function removePlayerHeart(userSocketId) {
        let playerHearts;
        for(let i = 0; i < playerAside.length; i++) if(playerAside[i].dataset.id === userSocketId) playerHearts = playerHearts = playerAside[i].querySelectorAll(".fas");

        const last = playerHearts[playerHearts.length - 1];
        last.classList.remove("fas")
        last.classList.add("far")
      }


      function resetOutput() {
        if(eliminated === false) {
          outputEliminated.style.display = "none";
          outputEliminated.classList.remove("show-fade-output")
        }

        outputCanStillQualify.style.display = "none";
        outputCanStillQualify.classList.remove("show-fade-output")

        outputQualified.style.display = "none";
        outputQualified.classList.remove("show-fade-output")
      }

      function handleOutput(string) {
        userOutputContainer.style.display = "grid";
        inputEmote.readOnly = true;
        inputEmote.value = "";
        resetOutput()

        if(string === "outputEliminated") {
          if(eliminated === false) {
            outputEliminated.style.display = "flex";
            outputEliminated.classList.add("show-fade-output")
          }
          eliminated = true;
        }
        if(string === "outputCanStillQualify") {
          outputCanStillQualify.style.display = "flex";
          outputCanStillQualify.classList.add("show-fade-output")
        }
        if(string === "outputQualified") {
          outputQualified.style.display = "flex";
          outputQualified.classList.add("show-fade-output")
        }
      }

      // ##################################################################
      // ##################################################################
      // ######################## HANDLE END ROUND ########################
      // ##################################################################
      // ##################################################################


      function handleEndRound() {
        waitSubmit = true;
        inputEmote.value = "";
        inputEmote.readOnly = true;

        // Resetting
        if(eliminated === false) userOutputContainer.style.display = "none";
        resetOutput();
        stopProgressBar();

        // Handle next step
        if(playerQualifiedCount === 1) handleWinner();

        if(playerQualifiedCount === 0) showCorrectAnswer();

        if(playerQualifiedCount > 1) prepNextRound();

      }

      // If someone WON
      function handleWinner() {
        playersRemaining.innerText = "0";
        // Add all players that has not qualified to the eliminated list
        const eliminatedPlayers = localUsers.filter(e => e.hasQualified === false)
        eliminatedPlayersDom(eliminatedPlayers);

        // Send gameEndPrivate to server so other players can now join the private room
        if(localUsers[0].room.isPrivate === true) socket.emit("gameEndPrivate", roomId)

        // Some game configurations
        gameEnded = true;
        inputEmote.value = "";
        stopProgressBar();

        if(socketId === playerQualified[0].dataset.id) {
          qualified = true;
          handleWinnerLoserDom("winner")
        } 
        if(socketId !== playerQualified[0].dataset.id) {
          handleWinnerLoserDom("loser")
        }
      }

      function handleWinnerLoserDom(result) {
        if(result === "winner") {
          outputEnd.style.backgroundColor = "rgba(11, 134, 32, 0.8)";
          outputWinLoseLabel.innerText = "YOU WIN";
          // confetti();
          confetti({
            particleCount: 150,
            startVelocity: 40,
            spread: 150,
            origin: {
              x: 0.4,
              y: 0.5
            }
          });
        }
        if(result === "loser") {
          outputEnd.style.backgroundColor = "rgba(172, 9, 9, 0.8)";
          const winner = localUsers.filter(e => e.hasQualified)
          outputWinLoseLabel.innerText = `${winner[0].username} WINS`;
        }
        emoteImgEnd.src = emoteImg.src;
        emoteNameEnd.innerText = currentEmote.name;
        outputEliminated.style.display = "none"
        userOutputContainer.style.display = "grid"
        outputEnd.style.display = "flex"
        outputEnd.classList.add("show-fade-next")
      }

      this.forceWin = function() {
        playersRemaining.innerText = "0";
        // If player is not eliminated, give him WIN. (of all the players left, there can only be 1 of them that is not eliminated)
        if(eliminated === false) {
          gameEnded = true;
          resetOutput();
  
          outputEnd.style.backgroundColor = "rgba(11, 134, 32, 0.8)";
          outputWinLoseLabel.innerText = "YOU WIN";
          confetti({
            particleCount: 150,
            startVelocity: 40,
            spread: 150,
            origin: {
              x: 0.4,
              y: 0.5
            }
          });
  
          emoteImgEnd.src = emoteImg.src;
          emoteNameEnd.innerText = currentEmote.name;
          outputEliminated.style.display = "none"
          userOutputContainer.style.display = "grid"
          outputEnd.style.display = "flex"
          outputEnd.classList.add("show-fade-next")
        }
        // Add player img to playersQualified if he is not there
        if(playerQualified[0].dataset.id !== localUsers[0].id) playerQualifiedImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/1/3.0`
      }


      function prepNextRound() {

        const eliminatedPlayers = localUsers.filter(e => e.hasQualified === false)

        // Set Aside DOM for eliminated players
        eliminatedPlayersDom(eliminatedPlayers);

        // Remove eliminated players from localUsers array
        removeEliminatedPlayers(eliminatedPlayers);

        // If user did not qualify before round end, send him message that he's eliminated
        roundEndUserEliminated();

        // Set users left in aside
        playersRemaining.innerText = localUsers.length;

        // SHOW CORRECT ANSWER AND GO TO NEXT ROUND.
        showCorrectAnswer();
      }

      function eliminatedPlayersDom(eliminatedPlayers) {
        for(let i = 0; i < playerAside.length; i++) {
          if(eliminatedPlayers.some(e => e.id === playerAside[i].dataset.id)) {
            console.log("FADE SCALE ANIMATION")
            // playerEliminatedContainer.innerHTML += `<li class="player-aside-eliminated fade-scale-animation"><img class="player-aside-img" src='${playerAsideImg[i].src}' alt=""><span class="player-aside-name">${playerAsideName[i].innerText}</span><span class="player-heart-eliminated-container"><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i></span></li>`
            playerEliminatedContainer.insertAdjacentHTML('beforeend', `<li class="player-aside-eliminated fade-scale-animation"><img class="player-aside-img" src='${playerAsideImg[i].src}' alt=""><span class="player-aside-name">${playerAsideName[i].innerText}</span><span class="player-heart-eliminated-container"><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i></span></li>`)
            playerAside[i].remove();
          }
          if(playerAside[i].dataset.disconnected === "true") playerAside[i].remove();
        }
        // Update list
        playerAside = document.querySelectorAll(".player-aside")
        playerAsideImg = document.querySelectorAll(".player-aside-img")
        playerAsideName = document.querySelectorAll(".player-aside-name")
      }

      function removeEliminatedPlayers(eliminatedPlayers) {
        for(let i = 0; i < eliminatedPlayers.length; i++) {
          localUsers.splice(localUsers.findIndex(x => x.id === eliminatedPlayers[i].id), 1)
        }
      }


      function roundEndUserEliminated() {
        if(qualified === false) {
          handleOutput("outputEliminated")
        }
      }


      // ############################
      // ##### GAME LOGIC (DOM) #####
      // ############################


      // INPUT ANIMATION IF GUESS IS WRONG
      const wrongGuessAnimation = () => {
        inputEmote.classList.add("input-wrong");
        inputEmote.classList.add("animate__headShake");

        setTimeout(function() {
          inputEmote.classList.remove("animate__headShake")
          inputEmote.classList.remove("input-wrong");
        }, 400)
      }

      // IF USER GUESSES CORRECT
      const handleRoundWin = () => {
        inputEmote.removeEventListener("keypress", guessListener)
        waitSubmit = true;

        emoteName.innerText = currentEmote.name;
        emoteName.classList.add("show-fade")
      }


      // IF USER GUESSES WRONG
      const handleRoundLose = () => {
        inputEmote.removeEventListener("keypress", guessListener)
        waitSubmit = true;
      }

    }

    // STARTS GAME
    battleRoyaleGame();
  }



  // Disconnect socket
  this.disconnectSocket = function() {
    socket.disconnect()
  }

  // HTML
  this.brGameHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="original-game">
      <div class="user-output-container">
        <div class="output-eliminated output-exit">
          <div class="output-exit-btn"><i class="fas fa-times"></i></div>
          <h1>YOU'RE ELIMINATED</h1>
          <div>
            <button class="spectate-btn">SPECTATE</button>
          </div>
        </div>
        <div class="output-can-still-qualify output-exit">
          <div class="output-exit-btn"><i class="fas fa-times"></i></div>
          <h1>NO GUESSES LEFT</h1>
          <div>You can still qualify if no one gets it right</div>
        </div>
        <div class="output-qualified output-exit">
          <div class="output-exit-btn"><i class="fas fa-times"></i></div>
          <h1>YOU QUALIFIED!</h1>
        </div>
        <div class="output-end output-exit" style="display: none">
          <div class="output-exit-btn"><i class="fas fa-times"></i></div>
          <div class="correct-answer-content">
            <img class="emote-img-end" src="" alt="">
            <h1 class="emote-name-end"></h1>
          </div>
          <h1 class="output-win-lose-label"></h1>
          <div class="output-buttons-container">
            <button class="br-play-again-btn">Play Again</button>
            <button class="br-main-menu-btn">Main Menu</button>
          </div>
        </div>
      </div>

      <div class="next-round-container">
        <div class="output-wait-next-round">
          <h1 class="correct-answer-label">CORRECT ANSWER</h1>
          <div class="correct-answer-content">
            <img class="output-emote-img" src="" alt="">
            <h1 class="output-correct"></h1>
          </div>
          <div>Next round starting in</div>
          <div class="next-round-starting-in">5.0...</div>
        </div>
      </div>
      <div class="game-starting-in-container">
        <div class="game-starting-in-box">
          <h1>Starting in</h1>
          <div class="game-starting-in-time">5.0...</div>
        </div>
      </div>
      <div class="game-upper">
        <h2 class="players-qualified-label">PLAYERS QUALIFIED:</h2>
        <div class="players-qualified-container">
        </div>
         <div class="game-upper-content-container">
          <div class="game-upper-content animate__animated animate__fast">
            <div class="emote-img-container">
              <img class="emote-img" src="" alt="">
              <h1 class="emote-name"></h1>
            </div>
          </div>
         </div>
      </div>
      <div class="game-lower">
        <div class="emote-container">
          <div class="wait-label">WAIT FOR NEXT EMOTE</div> 
          <input
          class="inputEmote animate__animated animate__faster" 
          type="text"
          maxlength="30"
          placeholder="TYPE HERE" 
          onfocus="this.placeholder = ''"
          onblur="this.placeholder = 'TYPE HERE'"
          autofocus
          readonly>
        </div>
        <h2 class="game-lower-label">GUESS THE NAME OF ABOVE EMOTE</h2>
        <div id="progressBar">
          <div class="bar"></div>
        </div>
      </div>
    </div>
      `
    )
  }



  // DOM (Generate now)
  let emoteImg = null
  let emoteName = null
  let gameResults = null
  let gameUpperContent = null
  let gameStartingInContainer = null
  let gameStartingIn = null
  let userOutputContainer = null
  let outputEliminated = null
  let outputCanStillQualify = null
  let outputQualified = null
  let outputWinLoseLabel = null
  let emoteImgEnd = null
  let emoteNameEnd = null
  let inputEmote = null
  let playersQualifiedContainer = null;
  let nextRoundContainer = null;
  let outputWaitNextRound = null;
  let outputEmoteImg = null;
  let outputCorrect = null;
  let nextRoundStartingIn = null;
  let bar = null;
  let brPlayAgainBtn = null;
  let brMainMenuBtn = null;
  let spectateBtn = null;
  let outputExitBtn = null;
  let playersRemaining = null;
  // Generate after initial HTML load
  let playerAside = null
  let playerAsideName = null
  let playerAsideImg = null
  let playerQualified = null
  let playerQualifiedImg = null
  let playerHearts = null;
  let waitLabel = null
  this.brGameDOM = function() {
    emoteImg = document.querySelector(".emote-img");
    emoteName = document.querySelector(".emote-name");
    gameResults = document.querySelector(".game-results");
    gameUpperContent = document.querySelector(".game-upper-content");
    gameStartingInContainer = document.querySelector(".game-starting-in-container");
    gameStartingIn = document.querySelector(".game-starting-in-time");
    userOutputContainer = document.querySelector(".user-output-container")
    outputEliminated = document.querySelector(".output-eliminated")
    outputCanStillQualify = document.querySelector(".output-can-still-qualify")
    outputQualified = document.querySelector(".output-qualified")
    outputEnd = document.querySelector(".output-end")
    outputWinLoseLabel = document.querySelector(".output-win-lose-label")
    emoteImgEnd = document.querySelector(".emote-img-end")
    emoteNameEnd = document.querySelector(".emote-name-end")
    inputEmote = document.querySelector(".inputEmote")
    playersQualifiedContainer = document.querySelector(".players-qualified-container")
    nextRoundContainer = document.querySelector(".next-round-container");
    outputWaitNextRound = document.querySelector(".output-wait-next-round")
    outputEmoteImg = document.querySelector(".output-emote-img");
    outputCorrect = document.querySelector(".output-correct")
    nextRoundStartingIn = document.querySelector(".next-round-starting-in");
    bar = document.querySelector(".bar")
    waitLabel = document.querySelector(".wait-label");
    brPlayAgainBtn = document.querySelector(".br-play-again-btn")
    brMainMenuBtn = document.querySelector(".br-main-menu-btn")
    spectateBtn = document.querySelector(".spectate-btn")
    outputExitBtn = document.querySelectorAll(".output-exit-btn")
    outputExit = document.querySelectorAll(".output-exit")
    playersRemaining = document.querySelector("#players-remaining")
  }

  this.brGameEVENT = function() {
    brPlayAgainBtn.addEventListener("click", function() {
      socket.disconnect();
      // Simple dom reset
      playerEliminatedContainer.innerHTML = "";

      if(main.dataset.isPrivate === "true") {
        initBattleRoyale("joinByLink"); // Initialize socket connection & Battle Royale Game
        lobbyRoom(); // Redirects to lobby room
      } else {
        // Find/Create new public lobby
        initBattleRoyale("public")
        lobbyRoom("public")
      }
    });

    brMainMenuBtn.addEventListener("click", function() {
      socket.disconnect();
      mainPage();
    })

    spectateBtn.addEventListener("click", function() {
      outputEliminated.style.display = "none";
    })

    for(let button of outputExitBtn) {
      button.addEventListener("click", function() {
        for(let i = 0; i < outputExit.length; i++) {
          outputExit[i].style.display = "none";
        }
      })
    }

  }


  brGameHTML();
  brGameDOM();
  brGameEVENT();
  battleRoyaleGameContainer();
  }

}

// Generate random username
function setUsername() {
  let id = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `Guest_${id}`;
}