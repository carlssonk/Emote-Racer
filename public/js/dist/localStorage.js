


// ####################################
// ############# COINS ################
// ####################################

const getCoins = () => {
  let coins = JSON.parse(localStorage.getItem("coins"));
  if(coins === null) coins = 0; // If user loads function for the first time

  return coins
}

const setCoins = (amount, code) => {
  if(typeof amount !== "number") return

  let coins = JSON.parse(localStorage.getItem("coins"));

  if(code === superSecretKeyToAccessUnlimitedAmountOfMoney.code) {
    coins += amount;
    localStorage.setItem("coins", JSON.stringify(coins))
  }
}


// ####################################
// ############# USERNAME #############
// ####################################

// GET USERNAME
const getUsername = () => {
  const username = localStorage.getItem("username");
  return username;
}

// SET USERNAME
const setUsername = (newName) => {
  localStorage.setItem("username", newName);
}

// GET USERNAME COLOR
const getUsernameColor = () => {
  const usernameColor = localStorage.getItem("usernameColor");
  return usernameColor;
}

// SET USERNAME COLOR
const setUsernameColor = (newColor) => {
  localStorage.setItem("usernameColor", newColor);
}


// ####################################
// ########## PROFILE IMAGE ###########
// ####################################

// GET PROFILE IMG
const getProfileImg = () => {
  const profileImg = localStorage.getItem("profileImg")
  return profileImg
}

// SET PROFILE IMG
const setProfileImg = (newImg) => {
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))
  // Find matching names and set new profile img
  for(let avatar of ownedAvatars) {
    if(avatar === newImg) {
      localStorage.setItem("profileImg", newImg)
    } 
  }
}


// #######################################
// ########## AVATARS / EMOTES ###########
// #######################################

// GET ALL AVATARS THAT THE USER OWNS
const getOwnedAvatars = () => {
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))
  return ownedAvatars
}

// BUY AVATAR
const buyAvatar = (newImg, code) => {
  console.log("BUYU AA")
  const ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars"))

  // Find matching names and set new profile img
  for(let emote of emoteAvatars) {
    if(emote.name === newImg && emote.code === code) {
      console.log("gogo")
      if(ownedAvatars.some(e => e === emote.url)) return // IF USER ALREADY OWNS THIS EMOTE, RETURN
      // Remove money from user
      console.log(-emote.price)
      setCoins(-emote.price, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
      // Add avatar to owned avatars
      ownedAvatars.push(emote.url)
      localStorage.setItem("ownedAvatars", JSON.stringify(ownedAvatars))
      // Set avatar as new profile img
      setProfileImg(emote.url)

    } 
  }
}


// #######################################
// ############ NAME COLOR ###############
// #######################################

// GET ALL COLORS THAT THE USER OWNS
const getOwnedColors = () => {
  const ownedColors = JSON.parse(localStorage.getItem("ownedColors"))
  return ownedColors
}

// BUY COLOR
const buyColor = (newColor, code) => {
  const ownedColors = JSON.parse(localStorage.getItem("ownedColors"))

  // Find matching color and set new name color
  for(let color of nameColors) {
    if(color.name === newColor && color.code === code) {

      if(ownedColors.some(e => e === color.css)) return // IF USER ALREADY OWNS THIS EMOTE, RETURN
      // Add avatar to owned avatars
      ownedColors.push(color.css)
      localStorage.setItem("ownedColors", JSON.stringify(ownedColors))
      // Set avatar as new profile img
      setUsernameColor(color.css)

    } 
  }
}




// SET USER PROFILE WHEN HE JOINS WEBSITE FOR THE FIRST TIME
if(getCoins() === null) localStorage.setItem("coins", JSON.stringify(0));

if(getUsername() === null) localStorage.setItem("username", generateUsername());

if(getUsernameColor() === null) localStorage.setItem("usernameColor", "black&white");

if(getProfileImg() === null) localStorage.setItem("profileImg", "https://static-cdn.jtvnw.net/emoticons/v1/1/3.0");

const initOwnedAvatars = ["https://static-cdn.jtvnw.net/emoticons/v1/1/3.0"]
if(getOwnedAvatars() === null) localStorage.setItem("ownedAvatars", JSON.stringify(initOwnedAvatars));

const initOwnedColors = ["black&white"] // Default refers to none
if(getOwnedColors() === null) localStorage.setItem("ownedColors", JSON.stringify(initOwnedColors));









// Username Generator

function generateUsername() {
  let id = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `Guest_${id}`;
}
