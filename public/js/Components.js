function roomIsFullLabel() {
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
}


// Used in battleRoyaleLobby.js
function waitingForOtherPlayers() {
  const gameStartingInShortly = document.querySelector(".game-starting-shortly-container")
  const waitingForOtherPlayers = document.querySelector(".waiting-for-other-players")
  gameStartingInShortly.classList.remove("waiting-label-show")
  waitingForOtherPlayers.classList.add("waiting-label-show")
}
function gameStartingInShortly() {
  const waitingForOtherPlayers = document.querySelector(".waiting-for-other-players")
  const gameStartingInShortly = document.querySelector(".game-starting-shortly-container")
  waitingForOtherPlayers.classList.remove("waiting-label-show")
  gameStartingInShortly.classList.add("waiting-label-show")
}


// Used in racerGameBattle.js
function waitingForOtherPlayersHIDE() {
  const waitingForOtherPlayers = document.querySelector(".waiting-for-other-players")
  waitingForOtherPlayers.style.display = "none"
}
function waitingForOtherPlayersSHOW() {
  const waitingForOtherPlayers = document.querySelector(".waiting-for-other-players")
  waitingForOtherPlayers.classList.add("waiting-label-show")
}
