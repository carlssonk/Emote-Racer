let socket;
initSocket = function() {
  return socket = io();
}
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
const infoAside = document.querySelector(".info-aside-container");
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
  initSocket();
  initBattleRoyale("joinByLink"); // Initialize socket connection & Battle Royale Game
  // lobbyRoom("private"); // Redirects to lobby room
} else if(location.pathname === "/1v1/" && location.search.length > 0) {
  initSocket();
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
  let page;
  if(typeof getCurrentPage === "function") page = getCurrentPage();
  pageChange(page);
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

  // function profileSettings() {
  //   if(profileNameInput.value !== "") username = profileNameInput.value;
  // }

  loadMainImgs();

  this.mainPageHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1>EMOTE RACER</h1>
        </div>
        <div class="games-container">
          <div class="game-box">
            <div>
              <h1>Battle Royale</h1>
              <p>Last man standing, up to 12 players. Match up against random players or challenge your friends.</p>
            </div>
            <div class="play-box">
              <button class="play-btn br-play-btn">Play</button>
            </div>
            <div class="game-icon"><img class="main-br-img main-game-icon" src="imgs/crown-fill.svg"></div>
          </div>
          <div class="game-box">
            <div>
              <h1>1 VS 1</h1>
              <p>Match up against another player or challenge your friend</p>
            </div>
            <div class="play-box">
              <button class="play-btn one-play-btn">Play</button>
            </div>
            <div class="game-icon"><img class="main-one-img main-game-icon" src="imgs/1v1-swords-fill.svg"></div>
          </div>
          <div class="game-box">
            <div>
              <h1>PRACTICE SOLO</h1>
              <p>Practice by yourself, imporve your emote guessing skills</p>
            </div>
            <div class="play-box">
              <button class="play-btn solo-play-btn">Play</button>
            </div>
            <div class="game-icon"><img class="main-solo-img main-game-icon" src="imgs/solo-fill.svg"></div>
          </div>
        </div>
      </div>
      
      `
    )
  }
  
  let playBtn = null;
  let saveProfileBtn = null;
  let profileNameInput = null;
  let roomIsFullLabel = null;
  let brPlayBtn = null;
  let onePlayBtn = null;
  let soloPlayBtn = null;

  let mainBrImg = null;
  let mainOneImg = null;
  let mainSoloImg = null;
  let mainGameIcon = null;
  this.mainPageDOM = function() {
    saveProfileBtn = document.querySelector(".save-profile-btn");
    profileNameInput = document.querySelector("#profile-name");
    roomIsFullLabel = document.querySelector(".room-is-full-label");
    playBtn = document.querySelectorAll(".play-btn")
    mainBrImg = document.querySelector(".main-br-img")
    mainOneImg = document.querySelector(".main-one-img")
    mainSoloImg = document.querySelector(".main-solo-img")
    mainGameIcon = document.querySelectorAll(".main-game-icon")
    brPlayBtn = document.querySelector(".br-play-btn")
    onePlayBtn = document.querySelector(".one-play-btn")
    soloPlayBtn = document.querySelector(".solo-play-btn")
  }
  
  this.mainPageEVENT = function() {
    // saveProfileBtn.addEventListener("click", profileSettings);
    for(let i = 0; i < playBtn.length; i++) {
      playBtn[i].addEventListener("mouseover", function() {
        mainGameIcon[i].classList.add("grayscale-zero")
      })
      playBtn[i].addEventListener("mouseleave", function() {
        mainGameIcon[i].classList.remove("grayscale-zero")
      })
    }

    brPlayBtn.addEventListener("click", function() {
      battleRoyalePage();
    });
    
    onePlayBtn.addEventListener("click", function() {
      soloPage();
    });
    
    soloPlayBtn.addEventListener("click", function() {
      onePage();
    });
    

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

{/* <div class="profile-name-container">
<label for="profile-name">USERNAME</label>
<input id="profile-name" type="text">
<button class="save-profile-btn">SAVE</button>
</div> */}

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
      <div>
      <h1>BATTLE ROYALE PAGE!</h1>
      <button class="quick-play-btn">QUICK PLAY</button>
      <button class="private-lobby-btn">PRIVATE LOBBY</button>
      </div>

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
      initSocket();
      initBattleRoyale("public")
    });
    privateLobbyBtn.addEventListener("click", () => {
      initSocket();
      initBattleRoyale("private")
    });
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
      initSocket();
      racerGameBattle("public");
    });
    play1v1PrivateBtn.addEventListener("click", function() {
      initSocket();
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
  for(let e of playerAside) e.style.backgroundColor = "";
  navAside.style.display = "block";
  infoAside.style.display = "block";
}

function pageChange(page) {
  if(page === "battle-royale") {
    socket.disconnect();
    if(typeof stopInitTimer === "function") stopInitTimer();
    if(typeof stopProgressBar === "function") stopProgressBar();
    if(typeof stopNextRoundTimer === "function") stopNextRoundTimer();
  }
  console.log(page)
  if(page === "lobby-page") {
    socket.disconnect();
  }
  if(page === "1v1") {
    socket.disconnect();
    if(typeof stopInitTimer === "function") stopInitTimer();
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





