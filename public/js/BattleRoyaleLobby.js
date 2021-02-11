// #################################################################################
// ########################## BATTLE ROYALE LOBBY ROOM #############################
// #################################################################################


// this.initSocket = function() {
//   return socket = io();
// }

// let socket;
// this.initSocket = function() {
//   return socket = io();
// }

function lobbyRoom(room) { // <--- room here refers to room.id
  // CONFIG
  main.dataset.page = "lobby-room"

  // Remove aside
  navAside.style.display = "none";
  battleRoyaleAside.style.display = "none";

  function initLobbyUser() {
    document.title = "PRIVATE LOBBY"
    if(room !== undefined) playerName[0].innerText = username;
    if(room !== undefined) playerLobbyImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    if(room !== undefined) history.pushState({urlPath: `/battle-royale/?${room}`},"",`/battle-royale/?${room}`)
    inviteLinkInput.value = window.location.href;
    roomId = location.search.substring(1);
  }

  function initLobbyUserPublic(room) {
    document.title = "PUBLIC LOBBY"
    playerName[0].innerText = username;
    playerLobbyImg[0].src = `https://static-cdn.jtvnw.net/emoticons/v1/${profileImg}/3.0`
    // history.pushState({urlPath: `/battle-royale/?${room}`},"",`/battle-royale/?${room}`)
    // inviteLinkInput.value = window.location.href;
    // roomId = location.search.substring(1);
    if(room === "public") {
      inviteLinkInput.style.display = "none";
    }
  }


  // Disconnect socket
  this.disconnectSocket = function() {
    socket.disconnect()
  }

  this.lobbyHTML = function() {
    return (
      main.innerHTML =
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
        <input class="invite-link-input" type="text" value="LINK HERE">
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
  let playerLobbyImg = null; 
  let lobbyTimer = null; 
  this.lobbyDOM = function() {
    playerName = document.querySelectorAll(".player-name");
    inviteLinkInput = document.querySelector(".invite-link-input");
    playerLobbyImg = document.querySelectorAll(".player-lobby-img");
    lobbyTimer = document.querySelector(".lobby-timer")
  }

  lobbyHTML(); // Loads html
  if(transition === true) pageTransition(); // Page transition
  lobbyDOM(); // Inits dom wiring
  if(room !== "public") initLobbyUser();
  if(room === "public") initLobbyUserPublic(room);

}