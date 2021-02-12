// #################################################################################
// ######################## GUESS THE EMOTE GAME (LOGIC) ###########################
// #################################################################################

// Temporary username and profileImg
// let username = setUsername();
// let profileImg = "1";


// Socket/Room config
// let socketId = "";
// let roomId = location.search.substring(1);



// let socket;
initSocket = function() {
  return socket = io();
}

function racerGameBattle(mode) {
  main.dataset.page = "1v1"

  initSocket();

  let localUsers = [];
  let emotesServer = [];
  let localRandomEmoteIndex = [];

  // Set local socketId
  socket.on("socketId", (id) => {
    socketId = id;
  });

  // Quickplay or Private lobby with friends
  if(mode === "public") socket.emit("quickPlay1v1", username, profileImg);
  if(mode === "private") socket.emit("createPrivateLobby1v1", username, profileImg);

  // Request join room by url
  if(mode === "joinByLink") socket.emit("requestJoin1v1", roomId, username, profileImg);

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
  });

  // Create and join unique room
  socket.on("initPrivateLobby1v1", (room) => {
    console.log("initPrivateLobby1v1")
    // Set INVITE LINK
    gameInfoLabelContainer.insertAdjacentHTML('beforeend', `<input class="racer-link-input" type="text" value="LINK HERE">`);
    racerLinkInput = document.querySelector(".racer-link-input");
    history.pushState({urlPath: `/1v1/?${room.id}`},"",`/1v1/?${room.id}`)
    racerLinkInput.value = location.href;

    // SET PLAYER DOM
    battlePlayerImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    battlePlayerName[0].innerText = username;
    battlePlayerReady[0].innerText = "NOT READY";

    // Set configurations
    roomId = room.id;
    localUsers = [{id: socketId, isReady: false}, {isReady: false}];

  });

  // Create and join unique room
  socket.on("initPublicLobby1v1", (room) => {
    console.log("initPublicLobby1v1")
    // SET PLAYER DOM
    battlePlayerImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    battlePlayerName[0].innerText = username;
    battlePlayerReady[0].innerText = "NOT READY";

    // Set configurations
    roomId = room.id;
    console.log(roomId)
    localUsers = [{id: socketId, isReady: false}, {isReady: false}];
  });

  // Update lobby when player joins
  socket.on("joinPublicLobby1v1", (users, room) => {
    roomId = room.id;
    console.log("joinPublicLobby1v1")

    if(users.length === 1) {

    // SET PLAYER DOM
    battlePlayerImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    battlePlayerName[0].innerText = username;
    battlePlayerReady[0].innerText = "NOT READY";

    // Set configurations
    console.log(roomId)
    localUsers = [{id: socketId, isReady: false}, {isReady: false}];

    } else {

      // Both users have their position at [0]
      if(socketId === users[0].id) {
        localUsers = users;
      } else {
        localUsers = users.reverse();
      }

      // LOBBY DOM
      console.log(localUsers)
      for(let i = 0; i < 2; i++) {
        battlePlayerImg[i].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
        battlePlayerName[i].innerText = localUsers[i].username
        battlePlayerReady[i].innerText = "NOT READY"
        battlePlayerReady[i].classList.remove("color-green") // Reset classname for player [0]
      }


      // Set isReady & score for localUsers
      localUsers[0].isReady = false;
      localUsers[1].isReady = false;

      localUsers[0].score = 0;
      localUsers[1].score = 0;

    }

  });


  // Update lobby when player joins
  socket.on("joinLobby1v1", (users) => {
    console.log("joinLobby1v1")

    if(users.length === 1) {

    // Set INVITE LINK
    gameInfoLabelContainer.insertAdjacentHTML('beforeend', `<input class="racer-link-input" type="text" value="LINK HERE">`);
    racerLinkInput = document.querySelector(".racer-link-input");
    racerLinkInput.value = location.href;

    // SET PLAYER DOM
    battlePlayerImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    battlePlayerName[0].innerText = username;
    battlePlayerReady[0].innerText = "NOT READY";

    // Set configurations
    localUsers = [{id: socketId, isReady: false}, {isReady: false}];

    } else {

      // Both users have their position at [0]
      if(socketId === users[0].id) {
        localUsers = users;
      } else {
        localUsers = users.reverse();
      }

      // LOBBY DOM
      console.log(localUsers)
      for(let i = 0; i < 2; i++) {
        battlePlayerImg[i].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
        battlePlayerName[i].innerText = localUsers[i].username
        battlePlayerReady[i].innerText = "NOT READY"
        battlePlayerReady[i].classList.remove("color-green") // Reset classname for player [0]
      }


      // Set isReady & score for localUsers
      localUsers[0].isReady = false;
      localUsers[1].isReady = false;

      localUsers[0].score = 0;
      localUsers[1].score = 0;

    }

  });





  // User Leave
  socket.on("userLeave1v1", (userSocketId, users, message) => {
    // Set INVITE LINK
    console.log(message)
    if(message === "private" && racerLinkInput === null || racerLinkInput === undefined ) {
      gameInfoLabelContainer.insertAdjacentHTML('beforeend', `<input class="racer-link-input" type="text" value="LINK HERE">`);
      racerLinkInput = document.querySelector(".racer-link-input");
      racerLinkInput.value = location.href;
    }

    battlePlayerImg[1].src = "";
    battlePlayerName[1].innerText = "";
    battlePlayerReady[1].innerText = "";

    const index = users.findIndex(e => e.id === userSocketId);
    localUsers.splice(index, 1)

    // TIMER && Force WIN!
    if(gameStarted === true) {
      stop1v1Timer();
      forceWin();
    }
  });





  
  // Listen for Lobby leader to start game
  this.requestStartGame1v1 = function() {
    socket.emit("requestStartGame1v1", roomId)
  }

  socket.on("startGame1v1", (emotesServer, randomEmoteIndexArr) => {
    console.log("1")
    // Set game configuration
    localEmotes = emotesServer;
    localRandomEmoteIndexArr = randomEmoteIndexArr;
    timer(); // Start game if all players are ready
  });

  socket.on("toggleReady1v1", (userSocketId) => {
    console.log("toggle ready")
    console.log(localUsers)
    // Toggle Ready for player
    for(let i = 0; i < localUsers.length; i++) {
      if(userSocketId === localUsers[i].id) {
        localUsers[i].isReady = !localUsers[i].isReady;

        if(localUsers[i].isReady) {
          battlePlayerReady[i].classList.remove("color-red")
          battlePlayerReady[i].classList.add("color-green")
          battlePlayerReady[i].innerText = "READY"
        } else {
          battlePlayerReady[i].classList.remove("color-green")
          battlePlayerReady[i].classList.add("color-red")
          battlePlayerReady[i].innerText = "NOT READY"
        }
      } 

    }

    console.log(localUsers)
    console.log(localUsers[0])
    // Start game!
    if(userSocketId === socketId) { // Isolate so only one player starts game
      if(localUsers.every(e => e.isReady)) {
        console.log("START GAME")
        requestStartGame1v1();
      } 
    } 
  });


  // ####################################
  // ########## GAME LOGIC ##############
  // ####################################


  // const emotes = getEmotes()

  // --Stats--
  // Speed
  let speed = 0;
  // Accuracy
  const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  let roundKeysTyped = 0;
  let totalKeysTyped = 0;
  let totalEmoteCharacters = 0;
  // Incorrect Guesses
  let incorrectGuesses = 0;
  // Game
  // let emotesClone = JSON.parse(JSON.stringify(emotes))
  let currentScore = 0;
  let currentEmote = {};
  let gameStarted = false;
  // So we can PRELOAD Second Image
  let cycleBool = false;
  let currentEmoteFirst = {};
  let currentEmoteLast = {};
  let randomEmoteIndex = 0;
  let randomEmoteIndex2 = 0;

  function timer() {
    // Configutation for game
    startGameConfig()

    // WORKERS
    myWorker.postMessage("startCountdown1v1")

    this.stop1v1Timer = function() {
      myWorker.postMessage("clearCountdown1v1")
      clearInterval(counter);
    }

    window.onfocus = function() {
      if(main.dataset.page === "1v1") myWorker.postMessage("updateCountdown1v1")
    };

    myWorker.onmessage = (e) => {
      if(e.data.name === "updateCountdown1v1") {
        count = e.data.message
      }
      if(e.data === "stopCountdown1v1") {
        clearInterval(counter)
      }
    }



    // Show timer
    racerGameTimerContainer.classList.remove("hide-fade");
    racerGameTimerContainer.style.display = ""
    
    // Timer logic
    let count = 60;
    let counter = setInterval(() => init1v1Timer(), 1000); //10 will  run it every 100th of a second
    function init1v1Timer() {
      count--;
      racerGameTimer.innerHTML=count + "s"; 
      if(count <= 0) {
        // When count hits 1, exec handleRoundEnd
        handleRoundEnd();
        clearInterval(counter)
        return;
      } 
    }
    initRound();
  }

  function startGameConfig() {
    gameStarted = true;
    inputEmote.readOnly = false;
    gameInfoLabelContainer.style.display = "none"
    gameUpperContent.style.transition = "100ms"
    circleBox.classList.add("racer-timer-bar")

    // Generate For First slot
    console.log(localRandomEmoteIndexArr)
    currentEmoteFirst = localEmotes[localRandomEmoteIndexArr[0]]
    localRandomEmoteIndexArr.splice(0, 1)
    console.log(localRandomEmoteIndexArr)
  }

  const initRound = (data) => {
    console.log("1")
    cycleBool = !cycleBool
    roundKeysTyped = 0;
    inputEmote.focus(); // Automatically focus input text

    gameUpperContent.style.marginTop = "500px"
    setTimeout(() => gameUpperContent.style.transform = "", 50)
    setTimeout(() => gameUpperContent.style.clip = "", gameUpperContent.style.position = "", 100)


    // This should never happen, but IF player has guessed all emotes, return
    if(localRandomEmoteIndexArr.length <= 0) return;
    // if(emotesClone.length <= 0) emotesClone = JSON.parse(JSON.stringify(emotes))

    // SHOW FIRST SLOT
    slotVisibility(cycleBool);

    // Set opposite img depending on bool
    setImg(cycleBool);

    // GENERATE NEW FOR OTHER SLOT
    generateImg(cycleBool, data);


    setTimeout(() => initRoundDOM(), 100)
  }


  function slotVisibility(cycleBool) {
    let num1;
    let num2;
    if(cycleBool === true) num1 = 0, num2 = 1;
    if(cycleBool === false) num1 = 1, num2 = 0;

    emoteImg[num1].style.height = "";
    emoteImg[num1].style.width = "";
    emoteImg[num1].style.visibility = "visible";
    emoteImg[num2].style.visibility = "hidden";
    emoteImg[num2].style.height = "0";
    emoteImg[num2].style.width = "0";
  }

  function setImg(cycleBool) {
    if(cycleBool === true) {
      if(currentEmoteFirst.provider === "twitch") emoteImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteFirst.id}/4.0`
      if(currentEmoteFirst.provider === "bttv") emoteImg[0].src = `https://cdn.betterttv.net/emote/${currentEmoteFirst.id}/3x`
      if(currentEmoteFirst.provider === "ffz") emoteImg[0].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteFirst.id}/4`
      currentEmote = currentEmoteFirst;
    } else {
      if(currentEmoteLast.provider === "twitch") emoteImg[1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteLast.id}/4.0`
      if(currentEmoteLast.provider === "bttv") emoteImg[1].src = `https://cdn.betterttv.net/emote/${currentEmoteLast.id}/3x`
      if(currentEmoteLast.provider === "ffz") emoteImg[1].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteLast.id}/4`
      currentEmote = currentEmoteLast;
    }
  }

  function generateImg(cycleBool, data) {
    console.log("---------------------")
    console.log(localRandomEmoteIndexArr)
    console.log("---------------------")
    // currentEmoteFirst = localEmotes[localRandomEmoteIndexArr[0]]
    // localRandomEmoteIndexArr.splice(0, 1)
    if(cycleBool === true) {
      // randomEmoteIndex2 = localEmotes[localRandomEmoteIndexArr[0]]
      currentEmoteLast = localEmotes[localRandomEmoteIndexArr[0]]

      if(currentEmoteLast.provider === "twitch") emoteImg[1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteLast.id}/4.0`
      if(currentEmoteLast.provider === "bttv") emoteImg[1].src = `https://cdn.betterttv.net/emote/${currentEmoteLast.id}/3x`
      if(currentEmoteLast.provider === "ffz") emoteImg[1].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteLast.id}/4`

      if(data === "skip") {
        const element = localRandomEmoteIndexArr[0]; // save element
        // console.log(localRandomEmoteIndexArr)
        localRandomEmoteIndexArr.splice(0, 1); // remove element
        localRandomEmoteIndexArr.push(element); // put it back at end of array
        // console.log(localRandomEmoteIndexArr)
      } else {
      //   console.log("NOT SKIP")
        localRandomEmoteIndexArr.splice(0, 1);
        // localEmotes.splice(localRandomEmoteIndexArr[0], 1)
      }
    } else {
      // randomEmoteIndex = Math.floor(Math.random() * emotesClone.length)
      currentEmoteFirst = localEmotes[localRandomEmoteIndexArr[0]]
  
      if(currentEmoteFirst.provider === "twitch") emoteImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${currentEmoteFirst.id}/4.0`
      if(currentEmoteFirst.provider === "bttv") emoteImg[0].src = `https://cdn.betterttv.net/emote/${currentEmoteFirst.id}/3x`
      if(currentEmoteFirst.provider === "ffz") emoteImg[0].src = `https://cdn.frankerfacez.com/emoticon/${currentEmoteFirst.id}/4`
  
      if(data === "skip") {
        const element = localRandomEmoteIndexArr[0]; // save element
        // console.log(localRandomEmoteIndexArr)
        localRandomEmoteIndexArr.splice(0, 1); // remove element
        localRandomEmoteIndexArr.push(element); // put it back at end of array
        // console.log(localRandomEmoteIndexArr)
      } else {
        console.log("NOT SKIP")
        localRandomEmoteIndexArr.splice(0, 1)
        // localEmotes.splice(localRandomEmoteIndexArr[0], 1)
      }
    }
  }


  const initRoundDOM = () => {
    gameUpperContent.style.marginTop = "80px"

    // SPEED TIMER
    setTimeout(function() {
      const speedInterval = setInterval(() => currentSpeed(), 10)
      function currentSpeed() {
        speed += 10;
      }
      this.stopSpeed = function() {
        clearInterval(speedInterval)
      }
    }, 90)
  }

  function guessListener(e) {
    togglePlayerReady(e); // Toggle player ready, when both players are ready, game will start
    if(gameStarted === true && e.key === "Enter") {
      if(inputEmote.value === "") return;
      const guess = inputEmote.value.toLowerCase();
      const emoteCode = currentEmote.name.toLowerCase();
      
      if(guess === emoteCode) {
        // STATS
        totalKeysTyped += roundKeysTyped; // GET TOTAL KEYS TYPED
        totalEmoteCharacters += currentEmote.name.length; // GET TOTAL EMOTE CHARACTERS
        stopSpeed(); // STOP SPEED TIMER

        socket.emit("userCorrect1v1", roomId, socketId) // Socket
        handleRoundWin();
        inputEmote = document.querySelector(".inputEmote")
      } else {
        incorrectGuesses++; // Incorrect Guesses
        wrongGuessAnimation()
      }
      inputEmote.value = "";
    }

    // ADD ROUND KEYS TYPED
    if(alphabet.includes(e.key.toLowerCase())) {
      roundKeysTyped++;
    }
  }

  let skipBool = true;
  function skipListener(e) {
    if(skipBool) {
      skipBool = false;

      if(gameStarted === true && e.key === "ArrowUp") {
        inputEmote.value = ""
        gameUpperContent.style.transform = "scale(0)"
  
        setTimeout(function() {
          gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";
          initRound("skip");
        }, 100)
      } 
      
      setTimeout(() => skipBool = true, 400)
    }
  }

  let toggleReadyBool = true;
  function togglePlayerReady(e) {
    if(gameStarted === false && e.key === "Enter") {
      // Prevent spam-click
      console.log(localUsers.filter(e => { return e.id }).length === 2)
      if(toggleReadyBool && localUsers.filter(e => { return e.id }).length === 2) {
        toggleReadyBool = false;
        socket.emit("toggleReady1v1", roomId)
        setTimeout(() => toggleReadyBool = true, 1000)
      }
    }
  }

  // ###############################################
  // ################## SOCKET #####################
  // ###############################################

  socket.on("userCorrect1v1", (userSocketId) => {
    console.log("CORRECt")

    for(let i = 0; i < localUsers.length; i++) {
      
      console.log(localUsers[i].id)
      console.log(userSocketId)
      if(localUsers[i].id === userSocketId) {
        console.log("OK")

        localUsers[i].score = localUsers[i].score + 1;

        battlePlayerScore[i].innerText = localUsers[i].score.toString();


        battlePlayerScoreFx[i].classList.remove("score-fx")
        setTimeout(() => battlePlayerScoreFx[i].classList.add("score-fx"), 50)

      }

    }
  });



  // ###############################################
  // ################## GAME LOCIG #################
  // ###############################################

  // DOM MANIPULATION WHEN USER GUESS WRONG
  const wrongGuessAnimation = () => {
    inputEmote.classList.add("input-wrong");
    inputEmote.classList.add("animate__headShake");

    setTimeout(function() {
      inputEmote.classList.remove("animate__headShake")
      inputEmote.classList.remove("input-wrong");
    }, 400)
  }

  // HANDLE CORRECT GUESS
  const handleRoundWin = () => {
    // Add score
    currentScore++;
    for(let score of finalScore) score.innerText = currentScore;

    // Emote animation
    gameUpperContent.style.transform = "scale(0)"

    setTimeout(function() {
      gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";
      initRound()
    }, 100)

  }


  // HANDLE ROUND END
  const handleRoundEnd = (message) => {
    if(message === undefined) handleRoundEndSocket();

    gameStarted = false;
    inputEmote.readOnly = true;
    inputEmote.value = "";
    gameResults.style.display = "block";
    gameResults.classList.add("racer-fade-output")
    gameUpperContent.style.marginTop = "500px";

    // CALCULATE STATS
    const avgSpeed = speed / currentScore;
    const avgSpeedText = `${Math.round(avgSpeed)}ms`
    resultSpeedStats.innerText = avgSpeedText;

    const accuracy = (totalEmoteCharacters / totalKeysTyped) * 100;
    const accuracyText = `${Math.round((accuracy + Number.EPSILON) * 100) / 100}%`
    resultAccuracyStats.innerText = accuracyText;

    resultIncorrectStats.innerText = incorrectGuesses;

    // Remove event listeners
    document.removeEventListener("keypress", guessListener)
    document.removeEventListener("keydown", skipListener)

  }

  function handleRoundEndSocket() {
    // Sort users by score
    const usersSorted = localUsers.sort((a,b) => b.score - a.score);
    console.log(usersSorted)
    if(usersSorted[0].score === usersSorted[1].score) {

      resultsTableDOM(usersSorted)

      gameResults.classList.remove("game-results-win")
      gameResults.classList.remove("game-results-lose")
      gameResults.classList.add("game-results-draw")
      winLoseLabel1v1.innerText = "DRAW"

    } else {

      // Set global DOM
      resultsTableDOM(usersSorted)

      // Set local DOM
      if(usersSorted[0].id === socketId) {
        winLoseLabel1v1.innerText = "YOU WIN"
        gameResults.classList.add("game-results-win")
      } else {
        winLoseLabel1v1.innerText = "YOU LOSE"
        gameResults.classList.add("game-results-lose")
      }
    }

    // SCORE
    for(let i = 0; i < 2; i++) {
      battlePlayerScoreBoard[i].innerText = usersSorted[i].score
    }

  }

  function resultsTableDOM(usersSorted) {
    // Set global DOM
    boardImg1v1[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${usersSorted[0].image}/3.0`
    boardImg1v1[1].src = `https://static-cdn.jtvnw.net/emoticons/v1/${usersSorted[1].image}/3.0`
    battlePlayerNameBoard[0].innerText = usersSorted[0].username;
    battlePlayerNameBoard[1].innerText = usersSorted[1].username;
  }

  function forceWin() {
    handleRoundEnd("force-win");

    boardImg1v1[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${localUsers[0].image}/3.0`
    battlePlayerNameBoard[0].innerText = localUsers[0].username;

    winLoseLabel1v1.innerText = "YOU WIN"
    gameResults.classList.add("game-results-win")

    circleBox.classList.remove("racer-timer-bar")
  }

  // Play again button execute
  const playAgainDomReset = () => {
    inputEmote.focus(); // Automatically focus input text
    for(let score of finalScore) score.innerText = currentScore; // Reset score
    gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";

    gameInfoLabelContainer.style.display = "block"
    circleBox.classList.remove("racer-timer-bar")
    inputEmote.readOnly = false;

    // Reset Stats
    speed = 0;
    roundKeysTyped = 0;
    totalKeysTyped = 0;
    totalEmoteCharacters = 0;
    incorrectGuesses = 0;

    // Reset socket related stuff
    resetSocketConfig()

    // Add event listener
    document.addEventListener("keypress", guessListener)
    document.addEventListener("keydown", skipListener)
  }


  function resetSocketConfig() {
    // DOM

    for(let rdy of battlePlayerReady) {
      rdy.classList.remove("color-red")
      rdy.classList.remove("color-green")
      rdy.innerText = "NOT READY"
    }

    for(let i = 0; i < localUsers.length; i++) {
      localUsers[i].score = 0;
      localUsers[i].isReady = false;
    }

    if(localUsers.length === 1) {
      battlePlayerReady[1].innerText = ""
      localUsers = [{id: socketId, isReady: false}, {isReady: false}];
    }
  }


    // Disconnect socket
    this.disconnectSocket = function() {
      socket.disconnect()
    }

  // #################################################################################
  // ############### GUESS THE EMOTE GAME (DYNAMIC PAGE CREATION) ####################
  // #################################################################################


  this.originalGameHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="original-game">
      <div class="game-results animate__animated animate__faster" style="display: none">
        <h1 class="win-lose-label-1v1"></h1>
        <div class="scoreboard-1v1">
          <div class="board-score-label">SCORE:</div>
          <div class="scoreboard-1 scoreboard-board-1v1">
            <h1 class="board-ranking-1v1">1</h1>
            <div class="battle-player-img-box"><img class="board-img-1v1" src="" alt=""></div>
            <div class="battle-player-name-board"></div>
            <div class="battle-player-score-board battle-player-score1">0</div>
          </div>
          <div class="scoreboard-2 scoreboard-board-1v1">
            <h1 class="board-ranking-1v1">2</h1>
            <div class="battle-player-img-box"><img class="board-img-1v1" src="" alt=""></div>
            <div class="battle-player-name-board"></div>
            <div class="battle-player-score-board battle-player-score1">0</div>
          </div>
        </div>
        <div class="share-container">
          <a class="share-btn twitter-share-btn" href="https://twitter.com/share?hashtags=awesome,sharing&text=Try to beat my score on EmoticonGuesser! Play it Now! &via=EmoticonGuesser" target="_blank">Tweet</a>
          <a class="share-btn facebook-share-btn" href="https://www.facebook.com/sharer/sharer.php?u=#url" target="_blank">Share</a>
        </div>
        <div class="result-stats">
          <h3>STATS</h3>
          <div>Speed: <span class="result-speed-stats"></span></div>
          <div>Accuracy: <span class="result-accuracy-stats"></span></div>
          <div>Incorrect Guesses: <span class="result-incorrect-stats"></span></div>
        </div>
        <div class="game-results-nav">
          <button class="game-nav-btn play-again-btn">PLAY AGAIN</button>
          <button class="game-nav-btn main-lobby-btn">MAIN LOBBY</button>
        </div>
      </div>
      <div class="game-info-label-container">
        <h2>GUESS AS MANY EMOTES AS YOU CAN UNDER 60 SECONDS</h2>
        <h2>PLAYER WITH THE HIGHEST SCORE WINS</h2>
        <h2>PRESS ENTER TO READY UP</h2>
      </div>
      <div class="game-upper game-upper2">
        <div class="racer-game-timer-container">
          <div class="racer-game-timer">60s</div>
          <svg class="circle-box" width="100%" height="100%">
            <circle cx="50%" cy="50%" r="47" stroke-width="6" fill="transparent"/>
          </svg>
        </div>
        <div class="battle-container-1v1">
          <div class="battle-player-box">
            <div class="battle-player-score-fx battle-player-score-fx1">+1</div>
            <div class="battle-player-score battle-player-score1">0</div>
            <div class="battle-player-img-box"><img class="battle-player-img" src="" alt=""></div>
            <div class="battle-player-name"></div>
            <div class="battle-player-ready">NOT READY</div>
          </div>
          <img class="battle-icon-1v1" src="/imgs/SwordsGlow.png" alt="">
          <div class="battle-player-box">
            <div class="battle-player-score-fx battle-player-score-fx2">+1</div>
            <div class="battle-player-score battle-player-score2">0</div>
            <div class="battle-player-img-box"><img class="battle-player-img" src="" alt=""></div>
            <div class="battle-player-name"></div>
            <div class="battle-player-ready"></div>
          </div>
        </div>
          <div class="game-upper-content-container">
          <div class="game-upper-content animate__animated animate__fast" style="margin-top: 500px">
            <div class="emote-img-container">
              <img class="emote-img" src="" alt="">
              <img class="emote-img" src="" alt="">
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
        <div class="game-skip-container">
          <h2 class="game-skip-label">PRESS ^ TO SKIP</h2>
        </div>
      </div>
    </div>
      `
    )
  }
  let emoteImg = null;
  let gameResults = null;
  let emoteName = null;
  let gameUpperContent = null;
  let finalScore = null;
  let playAgainBtn = null;
  let mainLobbyBtn = null;
  let inputEmote = null;
  let waitLabel = null;
  let racerGameTimerContainer = null;
  let racerGameTimer = null;
  let gameInfoLabelContainer = null;
  let circleBox = null;
  let racerLinkInput = null;
  let battlePlayerImg = null;
  let battlePlayerName = null;
  let battlePlayerReady = null;
  let battlePlayerScore = null;
  let battlePlayerScoreBoard = null;
  let battlePlayerScoreFx = null;
  let boardImg1v1 = null;
  let battlePlayerNameBoard = null;
  let boardRanking1v1 = null;
  let winLoseLabel1v1 = null;
  // stats
  let resultSpeedStats = null;
  let resultAccuracyStats = null;
  let resultIncorrectStats = null;
  this.originalGameDOM = function() {
  inputEmote = document.querySelector(".inputEmote");
  emoteImg = document.querySelectorAll(".emote-img");
  emoteName = document.querySelector(".emote-name");
  gameResults = document.querySelector(".game-results");
  gameUpperContent = document.querySelector(".game-upper-content");
  finalScore = document.querySelectorAll(".final-score");
  playAgainBtn = document.querySelector(".play-again-btn");
  mainLobbyBtn = document.querySelector(".main-lobby-btn");
  waitLabel = document.querySelector(".wait-label");
  racerGameTimerContainer = document.querySelector(".racer-game-timer-container");
  racerGameTimer = document.querySelector(".racer-game-timer");
  gameInfoLabelContainer = document.querySelector(".game-info-label-container")
  circleBox = document.querySelector(".circle-box")
  racerLinkInput = document.querySelector(".racer-link-input")
  battlePlayerImg = document.querySelectorAll(".battle-player-img")
  battlePlayerName = document.querySelectorAll(".battle-player-name")
  battlePlayerReady = document.querySelectorAll(".battle-player-ready")
  battlePlayerScore = document.querySelectorAll(".battle-player-score")
  battlePlayerScoreBoard = document.querySelectorAll(".battle-player-score-board")
  battlePlayerScoreFx = document.querySelectorAll(".battle-player-score-fx")
  boardImg1v1 = document.querySelectorAll(".board-img-1v1")
  battlePlayerNameBoard = document.querySelectorAll(".battle-player-name-board")
  boardRanking1v1 = document.querySelectorAll(".board-ranking-1v1")
  winLoseLabel1v1 = document.querySelector(".win-lose-label-1v1")

  // stats
  resultSpeedStats = document.querySelector(".result-speed-stats")
  resultAccuracyStats = document.querySelector(".result-accuracy-stats")
  resultIncorrectStats = document.querySelector(".result-incorrect-stats")
  }


  this.originalGameEVENT = function() {
    // inputEmote.addEventListener("keypress", guessListener)
    document.addEventListener("keypress", guessListener)
    document.addEventListener("keydown", skipListener)

    // Play Again
    playAgainBtn.addEventListener("click", function() {
      currentScore = 0;
      gameResults.style.display = "none"
      playAgainDomReset();
    });

    // Back To Main Page
    mainLobbyBtn.addEventListener("click", function() {
      mainPage();
    });
  }

  navAside.style.display = "none";

  originalGameHTML(); // Loads html
  pageTransition(); // Page transition
  originalGameDOM(); // Inits dom wiring
  originalGameEVENT(); // Inits event listeners

  inputEmote.focus(); // Automatically focus input text
  gameUpperContent.style.clip = "rect(0px,0px,0px,0px)", gameUpperContent.style.position = "absolute";

}

// // Generate random username
// function setUsername() {
//   let id = "";
//   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let charactersLength = characters.length;
//   for (var i = 0; i < 6; i++) {
//     id += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return `Guest_${id}`;
// }


