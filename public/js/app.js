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
const myProfileBtn = document.querySelector(".my-profile-btn");

// HTML APPEND ELEMENT´S
const mainContainer = document.querySelector(".main-container");
const main = document.querySelector(".main");
const game = document.querySelector(".game");
let mainLower = null;

// Extras
const adminMessage = document.querySelector(".admin-message")

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

myProfileBtn.addEventListener("click", function() {
  profilePage();
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

  loadMainImgs();

  this.mainPageHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <img class="landing-logo" src="imgs/EmoteRacer_Logo_v0.7.png">
        </div>
        <div class="games-container main-lower">
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
              <h1>1 vs 1</h1>
              <p>Match up against another player or challenge your friend</p>
            </div>
            <div class="play-box">
              <button class="play-btn one-play-btn">Play</button>
            </div>
            <div class="game-icon"><img class="main-one-img main-game-icon" src="imgs/1v1-swords-fill.svg"></div>
          </div>
          <div class="game-box">
            <div>
              <h1>Solo Practice</h1>
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
    mainLower = document.querySelector(".main-lower");
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
      onePage();
      
    });
    
    soloPlayBtn.addEventListener("click", function() {
      soloPage();
    });
    

  }

  pageChangeDisplay("main")

  mainPageHTML(); // Loads html
  mainPageDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
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
  document.title = "BATTLE ROYALE"
  history.pushState({urlPath:'/battle-royale'},"",'/battle-royale')

  this.battleRoyaleHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon" src="imgs/crown-fill.svg">BATTLE ROYALE<img class="title-icon" src="imgs/crown-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box quick-play-btn">
            <div class="button-card-label">Quick Play</div>
            <i class="fas fa-random play-icon"></i>
          </button>
          <button class="button-card-box private-lobby-btn">
            <div class="button-card-label">Private Lobby</div>
            <i class="fas fa-users play-icon"></i>
          </button>
        </div>
      </div>

      `
    )
  }

  let quickPlayBtn = null;
  let privateLobbyBtn = null;
  this.battleRoyaleDOM = function() {
    quickPlayBtn = document.querySelector(".quick-play-btn")
    privateLobbyBtn = document.querySelector(".private-lobby-btn")
    mainLower = document.querySelector(".main-lower");
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

  pageChangeDisplay("main")

  battleRoyaleHTML(); // Loads html
  battleRoyaleDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
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
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon" src="imgs/1v1-swords-fill.svg">1 VS 1<img class="title-icon" src="imgs/1v1-swords-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box play-1v1-btn">
            <div class="button-card-label">Quick Play</div>
            <i class="fas fa-random play-icon"></i>
          </button>
          <button class="button-card-box play-1v1-private-btn">
            <div class="button-card-label">Challenge a Friend</div>
            <i class="fas fa-user-plus play-icon"></i>
          </button>
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
    mainLower = document.querySelector(".main-lower");
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

  pageChangeDisplay("main")

  oneHTML(); // Loads html
  oneDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  oneEVENT(); // Inits event listeners

}

// #################################################################################
// ############################ GUESS THE EMOTE PAGE ###############################
// #################################################################################


function soloPage() {

  // CONFIG
  document.title = "GUESS THE EMOTE"
  history.pushState({urlPath:'/solo'},"",'/solo')

  this.soloHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="title-container">
          <h1><img class="title-icon" src="imgs/solo-fill.svg">SOLO PRACTICE<img class="title-icon" src="imgs/solo-fill.svg"></h1>
        </div>
        <div class="buttons-play-container main-lower">
          <button class="button-card-box play-racer-solo-btn">
            <div class="button-card-label">Racer Mode</div>
            <i class="fas fa-tachometer-alt play-icon"></i>
          </button>
          <button class="button-card-box play-original-solo-btn">
            <div class="button-card-label">Classic Mode</div>
            <i class="fas fa-angle-double-right play-icon"></i>
          </button>
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
    mainLower = document.querySelector(".main-lower");
  }

  this.soloEVENT = function() {
    playOriginalSoloBtn.addEventListener("click", function() {
      console.log("ORIGINAL GAME")
      originalGame();
    });
    playRacerSoloBtn.addEventListener("click", function() {
      racerGame();
    });
  }

  pageChangeDisplay("main")

  soloHTML(); // Loads html
  soloDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  soloEVENT(); // Inits event listeners

}

// #################################################################################
// ################################ PROFILE PAGE ###################################
// #################################################################################

function profilePage() {
  // CONFIG
  document.title = "PROFILE"
  history.pushState({urlPath:'/profile'},"",'/profile')

  function configuration() {
    profileImg.src = getProfileImg();
    profileName.value = getUsername();
  }

  this.profileHTML = function() {
    return (
      main.innerHTML =
      `
      <div class="landing-container">
        <div class="profile-label-container">
          <h1>My Profile</h1>
        </div>
        <div class="profile-card-box">
          <div class="profile-container">
            <div class="profile-img-box">
              <img class="profile-img" src="">
            </div>
            <div class="profile-name-box">
              <input type="text" class="profile-name" value="" maxlength="16">
            </div>
          </div>
          <div class="customize-label-container">
            <div>Name Colors</div>
            <div>Profile Images</div>
          </div>
          <div class="customize-container">
            <div class="custom-text-color-container">
              <div class="customize-column">
                <div class="color-box">
                <div>RED</div>
                <div class="name-color" style="color: red;">Plexer</div>
                <button class="buy-emote-btn">100</button>
                </div>
                <div class="color-box">
                <div>BLUE</div>
                <div class="name-color" style="color: blue;">Plexer</div>
                <button class="buy-emote-btn">100</button>
                </div>
                <div class="color-box">
                <div>CYAN</div>
                <div class="name-color" style="color: cyan;">Plexer</div>
                <button class="buy-emote-btn">100</button>
                </div>                                
              </div>
              <div class="customize-column">
                <div class="color-box">
                <div>ORANGE</div>
                <div class="name-color" style="color: orange;">Plexer</div>
                <button class="buy-emote-btn">100</button>
                </div>
                <div class="color-box">
                  <div>GOLD</div>
                  <div class="name-color" style="color: gold;">Plexer</div>
                  <button class="buy-emote-btn">100</button>
                </div>
                <div class="color-box">
                <div>BROWN</div>
                <div class="name-color" style="color: brown;">Plexer</div>
                <button class="buy-emote-btn">100</button>
                </div>                
              </div>
            </div>
            <div class="custom-emote-img-container">
              <div class="customize-column">
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/58ae8407ff7b7276f8e594f2/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
              </div>
              <div class="customize-column">
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
                <div class="emote-box">
                  <div>POGGERS</div>
                  <div class="emote-box-img">
                    <img src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x">
                  </div>
                  <button class="buy-emote-btn">100</button>
                </div>
              </div>                                        
            </div>
          </div>
          <div class="profile-save-box">
            <button class="profile-save-btn">SAVE</button>
          </div>

        </div>
      </div>
      `
    )
  }

  let profileImg = null;
  let profileName = null;

  this.profileDOM = function() {
    profileImg = document.querySelector(".profile-img")
    profileName = document.querySelector(".profile-name")
  }

  this.profileEVENT = function() {

  }

  pageChangeDisplay("main")

  profileHTML(); // Loads html
  profileDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  profileEVENT(); // Inits event listeners

  configuration();

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

function pageChangeDisplay(page) {
  battleRoyaleAside.style.display = "none";

  if(page === "main") {
    game.style.display = "none";
    mainContainer.style.display = "flex";
    navAside.style.display = "block";
  }
  if(page === "game") {
    game.style.display = "block";
    mainContainer.style.display = "none";
    navAside.style.display = "none";
  }
}

function pageTransition(page) {
  if(page === "main") {
    main.classList.remove("page-transition-top")
    main.classList.add("page-transition")
    main.style.animation = "none";
    main.offsetHeight; // Trigger reflow
    main.style.animation = null;
  }
  if(page === "game") {
    game.classList.remove("page-transition-top")
    game.classList.add("page-transition")
    game.style.animation = "none";
    game.offsetHeight; // Trigger reflow
    game.style.animation = null;
  }
}

function pageTransitionTop(page) {
  if(page === "main") {
    console.log(mainLower)
    mainLower.classList.add("page-transition")
    mainLower.classList.add("page-transition-top")
    mainLower.style.animation = "none";
    mainLower.offsetHeight; // Trigger reflow
    mainLower.style.animation = null;
  }
  if(page === "game") {
    game.classList.add("page-transition")
    game.classList.add("page-transition-top")
    game.style.animation = "none";
    game.offsetHeight; // Trigger reflow
    game.style.animation = null;
  }

}



// Admin message

function emoteFlyby(emote) {
  console.log(emote)
  adminMessage.classList.remove("admin-message-animation")
  setTimeout(function() {
    adminMessage.src = emote
    adminMessage.classList.add("admin-message-animation")
  }, 100)
  
}


function funMessages() {

  if(typeof socket === "object") {

    socket.on("emoteFlyby", (emote) => {
      emoteFlyby(emote)
    });

  }

}




