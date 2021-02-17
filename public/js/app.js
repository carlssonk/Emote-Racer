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
const mainFull = document.querySelector(".main-full");
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
    profileName.style.color = getUsernameColorV2()
    nameColorOwned[0].innerText = getUsername();

    // Color name to username
    setUsernameColorBox()

    // Set Owned Avatars
    for(let i = 0; i < emoteBoxUrl.length; i++) {
      for(let a = 1; a < getOwnedAvatars().length; a++) { // Start loop at 1, because First emote is already owned

        if(getOwnedAvatars()[a] === emoteBoxUrl[i].src) {
          // Set dom wiring
          setDomWiring(i)
        }
      }
    }

    // Set Owned Colors
    for(let i = 0; i < nameColor.length; i++) {
      for(let a = 1; a < getOwnedColors().length; a++) { // Start loop at 1, because First emote is already owned

        if(getOwnedColors()[a] === nameColor[i].style.color) {
          // Set dom wiring
          setDomWiringColor(i)
        }
      }
    }    

    // Reset Button Styling
    for(let btn of selectEmoteBtn) {
      btn.innerHTML = "OWNED"
    }

    // Reset Color Button Styling
    for(let btn of selectColorBtn) {
      btn.innerHTML = "OWNED"
    }

    // Set event listener for selecting emotes
    selectedEmoteListener()

    // Set event listener for selecting emotes
    selectedColorListener()    


    // Highlight current profileImg
    for(let i = 0; i < emoteBoxOwned.length; i++) {
      if(getProfileImg() === emoteBoxOwnedUrl[i].src) {
        emoteBoxOwned[i].classList.add("highlight-box")
        selectEmoteBtn[i].innerText = "SELECTED"
      } 
    }

    // Highlight current color
    for(let i = 0; i < colorBoxOwned.length; i++) {
      if(getUsernameColor() === nameColorOwned[i].style.color) {
        colorBoxOwned[i].classList.add("highlight-box-color")
        selectColorBtn[i].innerText = "SELECTED"
      } 
    }

  }

  function setUsernameColorBox() {
    for(let name of nameColor) {
      name.innerText = profileName.value
    }
  }


  // Change dom when user buys an emote
  function setBuyEmoteDom(i) {
    setDomWiring(i)
    // Clear highlight
    clearEmoteBoxOwnedHighlight()
  }

  // Change dom when user buys an color
  function setBuyColorDom(i) {
    setDomWiringColor(i)
    // Clear highlight
    clearColorBoxOwnedHighlight()
  }  


  function setDomWiring(i) {
    emoteBox[i+1].classList.add("emote-box-owned") // +1 because first emote is always owned
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")

    emoteBoxUrl[i].classList.add("emote-box-owned-url")
    emoteBoxOwnedUrl = document.querySelectorAll(".emote-box-owned-url")

    buyEmoteBtn[i].className = "select-emote-btn"
    selectEmoteBtn = document.querySelectorAll(".select-emote-btn")

    emoteBoxUrl = document.querySelectorAll(".emote-box-url")
  }

  function setDomWiringColor(i) {
    colorBox[i+1].classList.add("color-box-owned") // +1 because first emote is always owned
    colorBoxOwned = document.querySelectorAll(".color-box-owned")

    nameColor[i].classList.add("name-color-owned")
    nameColorOwned = document.querySelectorAll(".name-color-owned")

    buyColorBtn[i].className = "select-color-btn"
    selectColorBtn = document.querySelectorAll(".select-color-btn")

    nameColor = document.querySelectorAll(".name-color")
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
              <input type="text" class="profile-name" value="" maxlength="16" readonly>
              <button class="profile-edit-btn">EDIT</button>
            </div>
          </div>
          <div class="customize-label-container">
            <div>Name Colors</div>
            <div>Profile Images</div>
          </div>
          <div class="customize-container">
            <div class="custom-text-color-container">
              <div class="customize-column">
                <div class="color-box color-box-owned animate__animated animate__faster">
                  <div>BLACK/WHITE</div>
                  <div class="name-color-owned" style="color: white;"></div>
                  <button class="select-color-btn" data-name="white">100</button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div>BLUE</div>
                  <div class="name-color" style="color: blue;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="blue">100</button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div>CYAN</div>
                  <div class="name-color" style="color: cyan;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="cyan">100</button>
                </div>                                
              </div>
              <div class="customize-column">
                <div class="color-box animate__animated animate__faster">
                  <div>ORANGE</div>
                  <div class="name-color" style="color: orange;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="orange">100</button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div>GOLD</div>
                  <div class="name-color" style="color: gold;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="gold">100</button>
                </div>
                <div class="color-box animate__animated animate__faster">
                  <div>BROWN</div>
                  <div class="name-color" style="color: brown;"></div>
                  <button class="buy-color-btn" data-value="100" data-name="brown">100</button>
                </div>                
              </div>
            </div>
            <div class="custom-emote-img-container">
              <div class="customize-column">
                <div class="emote-box emote-box-owned animate__animated animate__faster">
                  <div>:)</div>
                  <div class="emote-box-img">
                    <img class="emote-box-owned-url" src="https://static-cdn.jtvnw.net/emoticons/v1/1/3.0">
                  </div>
                  <button class="select-emote-btn">SELECT</button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div>EZ</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="100" data-name="EZ">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div>Pepega</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5aca62163e290877a25481ad/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="100" data-name="Pepega">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
              </div>
              <div class="customize-column">
                <div class="emote-box animate__animated animate__faster">
                  <div>pepeHands</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/59f27b3f4ebd8047f54dee29/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="100" data-name="pepeHands">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div>OMEGALUL</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/583089f4737a8e61abb0186b/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="100" data-name="OMEGALUL">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
                <div class="emote-box animate__animated animate__faster">
                  <div>5Head</div>
                  <div class="emote-box-img">
                    <img class="emote-box-url" src="https://cdn.betterttv.net/emote/5d6096974932b21d9c332904/3x">
                  </div>
                  <button class="buy-emote-btn" data-value="100" data-name="5Head">100<img src="imgs/YEP_COIN.svg"></button>
                </div>
              </div>                                        
            </div>
          </div>
        </div>
      </div>
      `
    )
  }

  let profileImg = null;
  let profileName = null;
  // 
  let profileEditBtn = null;
  let profileNameBox = null;
  let emoteBox = null;
  let emoteBoxOwned = null;
  let emoteBoxOwnedUrl = null;
  let selectEmoteBtn = null;
  let emoteSelected = null;
  let buyEmoteBtn = null;
  let emoteBoxUrl = null;
  // 
  let colorBox = null;
  let nameColor = null;
  let buyColorBtn = null;
  let selectColorBtn = null;
  let colorBoxOwned = null;


  this.profileDOM = function() {
    profileImg = document.querySelector(".profile-img")
    profileName = document.querySelector(".profile-name")
    profileEditBtn = document.querySelector(".profile-edit-btn")
    profileNameBox = document.querySelector(".profile-name-box")
    emoteBox = document.querySelectorAll(".emote-box")
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")
    emoteBoxOwnedUrl = document.querySelectorAll(".emote-box-owned-url")
    selectEmoteBtn = document.querySelectorAll(".select-emote-btn")
    emoteSelected = document.querySelectorAll(".emote-selected")
    buyEmoteBtn = document.querySelectorAll(".buy-emote-btn")
    emoteBoxUrl = document.querySelectorAll(".emote-box-url")
    // 
    nameColor = document.querySelectorAll(".name-color")
    nameColorOwned = document.querySelectorAll(".name-color-owned")
    buyColorBtn = document.querySelectorAll(".buy-color-btn")
    colorBox = document.querySelectorAll(".color-box")
    selectColorBtn = document.querySelectorAll(".select-color-btn")
    colorBoxOwned = document.querySelectorAll(".color-box-owned")

  }

  this.profileEVENT = function() {
    // HANDLE PROFILE USERNAME
    let bool = true;
    profileEditBtn.addEventListener("click", function() {
      if(bool === true) {
        bool = !bool;
        profileName.focus();
        profileName.readOnly = false;

        // Styling
        profileEditBtn.innerText = "SAVE"
        profileName.style.cursor = "auto";
        profileNameBox.style.border = "2px solid black";
        profileNameBox.style.borderRadius = "6px";

      } else {
        if(profileName.value === "") return
        bool = !bool;
        setUsername(profileName.value) // Set new username in localStorage
        profileName.readOnly = true;

         // Styling
        profileEditBtn.innerText = "EDIT"
        profileName.style.cursor = "";
        profileNameBox.style.border = "";
        profileNameBox.style.borderRadius = "";

        // Color name to username
        setUsernameColorBox()

      }
    });
  }

   // AVATAR

  function buyEmoteBtnListener(e) {
    const btn = e.target
    for(let i = 0; i < emoteAvatars.length; i++) {
      // Check if DOM matches the code
      if(btn.dataset.name === emoteAvatars[i].name && btn.dataset.value === emoteAvatars[i].price.toString()){
        
        // Buy Avatar if he has enough coins
        if(getCoins() >= emoteAvatars[i].price) {
          buyAvatar(emoteAvatars[i].name, emoteAvatars[i].code)
          setBuyEmoteDom(i);
          selectedEmoteListener();
        } else {
          if(btn.className === "select-emote-btn") return

          emoteBox[i+1].classList.add("input-wrong");
          emoteBox[i+1].classList.add("animate__headShake");
          setTimeout(() => {
            emoteBox[i+1].classList.remove("input-wrong");
            emoteBox[i+1].classList.remove("animate__headShake");
          }, 300)
        }

      }
    }
  }

  function selectedEmoteListener() {
    emoteBoxOwned = document.querySelectorAll(".emote-box-owned")
    for(let i = 0; i < emoteBoxOwned.length; i++) {
      emoteBoxOwned[i].addEventListener("click", function() {
        // Clear highlight
        clearEmoteBoxOwnedHighlight()

        // Set New highlight
        emoteBoxOwned[i].classList.add("highlight-box") // -1 because first emote is always owned
        selectEmoteBtn[i].innerText = "SELECTED" // -1 because first emote is always owned

        // Set Profile Img
        setProfileImg(emoteBoxOwnedUrl[i].src)
        // Set Profile Img DOM
        profileImg.src = getProfileImg();
      })
    }
  }
  function clearEmoteBoxOwnedHighlight() {
    for(let x = 0; x < emoteBoxOwned.length; x++) {
      emoteBoxOwned[x].classList.remove("highlight-box") 
      selectEmoteBtn[x].innerText = "OWNED"
    }
  }

  // COLOR

  function buyColorBtnListener(e) {
    const btn = e.target
    for(let i = 0; i < nameColors.length; i++) {
      // Check if DOM matches the code
      if(btn.dataset.name === nameColors[i].name && btn.dataset.value === nameColors[i].price.toString()){
        
        // Buy Avatar if he has enough coins
        if(getCoins() >= nameColors[i].price) {
          buyColor(nameColors[i].name, nameColors[i].code)
          setBuyColorDom(i);
          selectedColorListener();
        } else {
          if(btn.className === "select-color-btn") return

          colorBox[i+1].classList.add("input-wrong");
          colorBox[i+1].classList.add("animate__headShake");
          setTimeout(() => {
            colorBox[i+1].classList.remove("input-wrong");
            colorBox[i+1].classList.remove("animate__headShake");
          }, 300)
        }

      }
    }
  } 

  function selectedColorListener() {
    colorBoxOwned = document.querySelectorAll(".color-box-owned")
    for(let i = 0; i < colorBoxOwned.length; i++) {
      colorBoxOwned[i].addEventListener("click", function() {
        // Clear highlight
        clearColorBoxOwnedHighlight()

        // Set New highlight
        colorBoxOwned[i].classList.add("highlight-box-color") // -1 because first emote is always owned
        selectColorBtn[i].innerText = "SELECTED" // -1 because first emote is always owned

        // Set Profile Img
        setUsernameColor(selectColorBtn[i].dataset.name);
        // Set Profile Img DOM
        profileName.style.color = getUsernameColorV2();
      })
    }
  }
  function clearColorBoxOwnedHighlight() {
    for(let x = 0; x < colorBoxOwned.length; x++) {
      colorBoxOwned[x].classList.remove("highlight-box-color") 
      selectColorBtn[x].innerText = "OWNED"
    }
  }

  // INIT FUNCITONS

  pageChangeDisplay("main")

  profileHTML(); // Loads html
  profileDOM(); // Inits dom wiring
  if(transition === true) pageTransitionTop("main"); // Page transition
  profileEVENT(); // Inits event listeners
  for(let btn of buyEmoteBtn) {
    btn.addEventListener("click", buyEmoteBtnListener)
  }
  for(let btn of buyColorBtn) {
    btn.addEventListener("click", buyColorBtnListener)
  }

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

function getUsernameColorV2() {
  let color = getUsernameColor();

  if(color === "white") color = "";
  
  return color
}


// Admin message

function emoteFlyby(emote) {
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




