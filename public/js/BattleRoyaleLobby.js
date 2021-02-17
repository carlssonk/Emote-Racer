function lobbyRoom(roomName, roomId, users) {

  function configuration() {
    const profileImg = getProfileImg();
    const username = getUsername();

    // DOM
    navAside.style.display = "none";
    infoAside.style.display = "none";
    battleRoyaleAside.style.display = "none";


    if(users.length === 0) {
      if(roomName === "brPrivate") initLobbyUserPrivate();
      if(roomName === "brPublic") initLobbyUserPublic();
    }


    this.joinLobbyUserPublic = function(users) {
      // User Join DOM
      joinLobbyUser(users)

      // Game Starting in/Waiting for players Label
      if(users.length <= 2) {
        waitingForOtherPlayers()
      } else {
        gameStartingInShortly()
      }

      inviteLinkBox.style.display = "none";
    }


    this.joinLobbyUserPrivate = function(users) {
      // User Join DOM
      joinLobbyUser(users)

      // Start Game Button
      if(users.length > 1 && socket.id === users[0].id) {
        startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
        const startGameBtn = document.querySelector(".start-game-btn")
        startGameBtn.addEventListener("click", brStartGame)
      }
      // LINK
      inviteLinkInput.value = window.location.href;
    }


    function joinLobbyUser(users) {
      for(let i = 0; i < users.length; i++) {
        playerName[i].innerText = users[i].username
        playerLobbyImg[i].src = users[i].profileImg
        console.log(users[i].profileImg)
        console.log(users[i])
        lobbyPlayer[i].classList.add("fade-scale-animation")
      }
    }

    this.leaveLobbyUser = function(userSocketId, users) {

      const index = users.findIndex(e => e.id === userSocketId);

      // console.log(users)

      // Remove img and name for last position
      playerName[users.length - 1].innerText = "";
      playerLobbyImg[users.length - 1].src = "";
      lobbyPlayer[users.length - 1].classList.remove("fade-scale-animation")

      if(index !== -1) {
        users.splice(index, 1)
      }

      // If not last person in array left, set new positions
      if(index !== users.length) {
        for(let i = 0; i < users.length; i++) {
          playerName[i].innerText = users[i].username
          playerLobbyImg[i].src = users[i].profileImg
          console.log(users[i].profileImg)
        }
      }

      console.log(index)
      console.log(users)
      // Below code depends if lobby is private or public

      // If first user left, i.e. lobby leader, set new play button for new leader
      if(index === 0 && users[0].room.isPrivate === true)  {
        if(socket.id === users[0].id && users.length > 1) {
          startGameBtnContainer.innerHTML = `<button class="start-game-btn">Start Game!</button>`
          const startGameBtn = document.querySelector(".start-game-btn")
          startGameBtn.addEventListener("click", brStartGame)
        }
      }
      if(users[0].room.isPrivate === true && users.length === 1) {
        startGameBtnContainer.innerHTML = ""
      }

      // Waiting label...
      if(users[0].room.isPrivate === false) {
        if(users.length <= 2) {
          waitingForOtherPlayers()
        }
      }

    }

  

    function initLobbyUserPrivate() {
      document.title = "PRIVATE LOBBY"
      // DOM
      setDom();
      // LINK
      history.pushState({urlPath: `/battle-royale/?${roomId}`},"",`/battle-royale/?${roomId}`)
      inviteLinkInput.value = window.location.href;
    }

    function initLobbyUserPublic() {
      document.title = "PUBLIC LOBBY"
      // DOM
      setDom();
      waitingForOtherPlayers();

      inviteLinkBox.style.display = "none";
    }

    function setDom() {
      playerName[0].innerText = username;
      playerLobbyImg[0].src = profileImg
    }

    // // Disconnect socket
    // this.disconnectSocket = function() {
    //   socket.removeAllListeners()
    //   if(roomName === "brPublic") socket.emit("leaveUser", "battleRoyalePublic", roomId)
    //   if(roomName === "brPrivate") socket.emit("leaveUser", "battleRoyalePrivate", roomId)
    // }

  }

  this.lobbyHTML = function() {
    return (
      game.innerHTML =
      `
      <div class="lobby-container">
      <div class="lobby-players-container">
        <div class="seperate-players-box">
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
        </div>
        <div class="seperate-players-box">
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
          <div class="lobby-player">
            <div class="player-img-box"><img class="player-lobby-img" src="" alt=""></div>
            <div class="player-name"></div>
          </div>
        </div>     
      </div>
      <div class="invite-link-container">
        <div class="invite-link-box">
          <div class="invite-link-first">
            <div class="invite-link-label">HOVER TO SEE INVITE LINK</div>
            <input class="invite-link-input" type="text" value="LINK HERE">
          </div>
          <div class="invite-link-second">
            <button class="invite-copy-btn">COPY</button>
          </div>
        </div>
        
        <div class="start-game-btn-container"></div>
        <h1 class="waiting-for-other-players">Waiting for players <span class="mini-dot-1">.</span><span class="mini-dot-2">.</span><span class="mini-dot-3">.</span></h1>
        <div class="game-starting-shortly-container">
          <h1>Game starting in shortly</h1>
          <div class="pulse-container">
            <div class="dot-1"></div>
            <div class="dot-2"></div>
            <div class="dot-3"></div>
          </div>
        </div>
      </div>
    </div>
      `
    )
  }

  let playerName = null;
  let inviteLinkInput = null;
  let inviteLinkBox = null;
  let playerLobbyImg = null; 
  let lobbyTimer = null;
  let inviteCopyBtn = null;
  let lobbyPlayer = null
  let startGameBtnContainer = null;
  this.lobbyDOM = function() {
    playerName = document.querySelectorAll(".player-name");
    inviteLinkInput = document.querySelector(".invite-link-input");
    playerLobbyImg = document.querySelectorAll(".player-lobby-img");
    inviteLinkBox = document.querySelector(".invite-link-box");
    lobbyTimer = document.querySelector(".lobby-timer")
    inviteCopyBtn = document.querySelector(".invite-copy-btn");
    lobbyPlayer = document.querySelectorAll(".lobby-player")
    startGameBtnContainer =  document.querySelector(".start-game-btn-container")
  }

  this.lobbyEVENT = function() {
    // INVITE LINK COPY
    inviteCopyBtn.addEventListener("click", function() {
      /* Select the text field */
      inviteLinkInput.select();
      inviteLinkInput.setSelectionRange(0, 99999); /*For mobile devices*/
      document.execCommand("copy");

      inviteCopyBtn.innerText = "COPIED!"
      inviteCopyBtn.classList.add("copied-animation")
    });
  }

  pageChangeDisplay("game")

  lobbyHTML(); // Loads html
  console.log(transition)
  if(transition === true) pageTransition("game"); // Page transition
  lobbyDOM(); // Inits dom wiring
  lobbyEVENT(); // Inits event listeners

  configuration();

}


