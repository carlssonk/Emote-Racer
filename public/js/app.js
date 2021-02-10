// #################################################################################
// ############################### DOM DECLARATION #################################
// #################################################################################

// ICONS (So we can load images when page switches)
const asideIcon1 = document.querySelector(".aside-icon-1")
const asideIcon2 = document.querySelector(".aside-icon-2")
const asideIcon3 = document.querySelector(".aside-icon-3")
const asideIcon4 = document.querySelector(".aside-icon-4")

// Header and Aside nav.
const navLogo = document.querySelector("#nav-logo");
const navAside = document.querySelector(".nav-aside");
const playerAside = document.querySelectorAll(".player-aside");
const battleRoyaleAside = document.querySelector(".battle-royale-aside");
const battleRoyaleBtn = document.querySelector(".battle-royale-btn");
const soloBtn = document.querySelector(".solo-btn");
const oneVsOneBtn = document.querySelector(".one-vs-one-btn");

// HTML APPEND ELEMENT´S
const main = document.querySelector(".main");

// #################################################################################
// ############################### PAGE INITIALIZATION #############################
// #################################################################################


// INIT PAGE
let transition = false // <-- we dont want to have a transition when page loads
window.onload = () => transition = true;

// Choose what page to load depending on the URL
if(window.location.pathname === "/") {
  mainPage();
} else if(window.location.pathname === "/battle-royale") {
  battleRoyalePage();
} else if(location.pathname === "/battle-royale/" && location.search.length > 0) { // I.E. if a battle royale link
  initBattleRoyale("joinByLink"); // Initialize socket connection & Battle Royale Game
  lobbyRoom(); // Redirects to lobby room
} else if(location.pathname === "/1v1/" && location.search.length > 0) {
  racerGameBattle("joinByLink") // Initialize socket connection & 1v1 Game
} else if(window.location.pathname === "/solo") {
  soloPage();
} else if(window.location.pathname === "/1v1") {
  onePage();
}


// #################################################################################
// ############################## MAIN PAGE NAVIGATION #############################
// #################################################################################


navLogo.addEventListener("click", function() {
  const prevPage = main.dataset.page;
  pageChange(prevPage);
  mainPage();
});

battleRoyaleBtn.addEventListener("click", function() {
  battleRoyalePage();
});

soloBtn.addEventListener("click", function() {
  soloPage();
});

oneVsOneBtn.addEventListener("click", function() {
  onePage();
});

// #################################################################################
// ############################### MAIN PAGE #######################################
// #################################################################################


function mainPage() {

  // CONFIG
  mainPageReset()
  battleRoyaleAside.style.display = "none";
  document.title = "MAIN PAGE"
  history.pushState({urlPath:'/'},"",'/')

  function profileSettings() {
    if(profileNameInput.value !== "") username = profileNameInput.value;
  }

  loadMainImgs();

  this.mainPageHTML = function() {
    return (
      main.innerHTML =
      `
      <h1>This is the main page!</h1>
      <div class="profile-name-container">
        <label for="profile-name">USERNAME</label>
        <input id="profile-name" type="text">
        <button class="save-profile-btn">SAVE</button>
      </div>
      `
    )
  }
  
  let saveProfileBtn = null;
  let profileNameInput = null;
  let roomIsFullLabel = null;
  this.mainPageDOM = function() {
    saveProfileBtn = document.querySelector(".save-profile-btn");
    profileNameInput = document.querySelector("#profile-name");
    roomIsFullLabel = document.querySelector(".room-is-full-label");
  }
  
  this.mainPageEVENT = function() {
    saveProfileBtn.addEventListener("click", profileSettings);
  }

  mainPageHTML(); // Loads html
  if(transition === true) pageTransitionTop(); // Page transition
  mainPageDOM(); // Inits dom wiring
  mainPageEVENT(); // Inits event listeners


}

function loadMainImgs() {
  asideIcon1.src = "imgs/crown.svg"
  asideIcon2.src = "imgs/1v1-swords.svg"
  asideIcon3.src = "imgs/solo.svg"
  asideIcon4.src = "imgs/user.svg"
}


// #################################################################################
// ############################### BATTLE ROYALE PAGE ##############################
// #################################################################################


function battleRoyalePage() {

  // CONFIG
  battleRoyaleAside.style.display = "none";
  document.title = "BATTLE ROYALE"
  history.pushState({urlPath:'/battle-royale'},"",'/battle-royale')

  this.battleRoyaleHTML = function() {
    return (
      main.innerHTML =
      `
      <h1>BATTLE ROYALE PAGE!</h1>
      <button class="quick-play-btn">QUICK PLAY</button>
      <button class="private-lobby-btn">PRIVATE LOBBY</button>
      `
    )
  }

  let quickPlayBtn = null;
  let privateLobbyBtn = null;
  this.battleRoyaleDOM = function() {
    quickPlayBtn = document.querySelector(".quick-play-btn")
    privateLobbyBtn = document.querySelector(".private-lobby-btn")
  }

  this.battleRoyaleEVENT = function() {
    quickPlayBtn.addEventListener("click", () => {
      initBattleRoyale("public")
      lobbyRoom("public")
    });
    privateLobbyBtn.addEventListener("click", () => initBattleRoyale("private"))
  }

  battleRoyaleHTML(); // Loads html
  if(transition === true) pageTransitionTop(); // Page transition
  battleRoyaleDOM(); // Inits dom wiring
  battleRoyaleEVENT(); // Inits event listeners

}


// #################################################################################
// ############################### BATTLE ROYALE PAGE ##############################
// #################################################################################


function onePage() {
  // CONFIG
  document.title = "1v1"
  history.pushState({urlPath:'/1v1'},"",'/1v1')

  this.oneHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="solo-page-container">
        <div class="solo-page-left">
          <div class="solo-left-card">
            <button class="play-1v1-btn">Quick Play</button>
          </div>
        </div>
        <div class="solo-page-right">
          <div class="solo-right-card">
            <button class="play-1v1-private-btn">Challenge a Friend</button>
          </div>
        </div>
      </div>
      `
    )
  }

  let play1v1Btn = null;
  let play1v1PrivateBtn = null;
  this.oneDOM = function() {
    play1v1Btn = document.querySelector(".play-1v1-btn");
    play1v1PrivateBtn = document.querySelector(".play-1v1-private-btn");
  }

  this.oneEVENT = function() {
    play1v1Btn.addEventListener("click", function() {
      racerGameBattle("public");
    });
    play1v1PrivateBtn.addEventListener("click", function() {
      racerGameBattle("private");
    });
  }

  oneHTML(); // Loads html
  if(transition === true) pageTransitionTop(); // Page transition
  oneDOM(); // Inits dom wiring
  oneEVENT(); // Inits event listeners

}


// #################################################################################
// ############################ GUESS THE EMOTE PAGE ###############################
// #################################################################################


function soloPage() {

  // CONFIG
  battleRoyaleAside.style.display = "none";
  document.title = "GUESS THE EMOTE"
  history.pushState({urlPath:'/solo'},"",'/solo')

  this.soloHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="solo-page-container">
        <div class="solo-page-left">
          <div class="solo-left-card">
            <button class="play-racer-solo-btn">RACER MODE</button>
          </div>
        </div>
        <div class="solo-page-right">
          <div class="solo-right-card">
            <button class="play-original-solo-btn">CLASSIC MODE</button>
          </div>
        </div>
      </div>
      `
    )
  }

  let playOriginalSoloBtn = null;
  let playRacerSoloBtn = null;
  this.soloDOM = function() {
    playOriginalSoloBtn = document.querySelector(".play-original-solo-btn");
    playRacerSoloBtn = document.querySelector(".play-racer-solo-btn");
  }

  this.soloEVENT = function() {
    playOriginalSoloBtn.addEventListener("click", function() {
      originalGame();
    });
    playRacerSoloBtn.addEventListener("click", function() {
      racerGame();
    });
  }

  soloHTML(); // Loads html
  if(transition === true) pageTransitionTop(); // Page transition
  soloDOM(); // Inits dom wiring
  soloEVENT(); // Inits event listeners

}


// #################################################################################
// ################################# EXTRAS ########################################
// #################################################################################


// When Nav-Logo is clicked
function mainPageReset() {
  main.dataset.page = "main-page"
  for(let e of playerAside) e.style.backgroundColor = "";
  navAside.style.display = "block";
}

function pageChange(prevPage) {
  if(prevPage === "battle-royale") {
    disconnectSocket();
    if(typeof stopInitTimer === "function") stopInitTimer();
    if(typeof stopProgressBar === "function") stopProgressBar();
    if(typeof stopNextRoundTimer === "function") stopNextRoundTimer();
  }
  if(prevPage === "lobby-room") {
    disconnectSocket();
  }
  if(prevPage === "1v1") {
    disconnectSocket();
    if(typeof stop1v1Timer === "function") stop1v1Timer();
  }
}

function pageTransition() {
  main.classList.remove("page-transition-top")
  main.classList.add("page-transition")
  main.style.animation = "none";
  main.offsetHeight; // Trigger reflow
  main.style.animation = null;
}

function pageTransitionTop() {
  main.classList.add("page-transition")
  main.classList.add("page-transition-top")
  main.style.animation = "none";
  main.offsetHeight; // Trigger reflow
  main.style.animation = null;
}



