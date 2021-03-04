
// #####################################
// ########### LOCAL STORAGE ###########
// #####################################

function gtagBuyEmote(emote) {
  dataLayer.push({
    "event": "buyEmoteTrigger",
    "emote": emote.name
  })
}

function gtagBuyColor(color) {
  dataLayer.push({
    "event": "buyColorTrigger",
    "color": color.name
  })
}

function setCoinsTagManager(amount) {
  if(amount === 5) {
    dataLayer.push({
      "event": "setCoinsTrigger",
      "amount": amount,
      "game": "1 VS 1 (Force Win)"
    })
  }
  if(amount === 10) {
    dataLayer.push({
      "event": "setCoinsTrigger",
      "amount": amount,
      "game": "1 VS 1"
    })
  }
  if(amount === 25) {
    dataLayer.push({
      "event": "setCoinsTrigger",
      "amount": amount,
      "game": "Battle Royale (Force Win)"
    })
  }
  if(amount === 50) {
    dataLayer.push({
      "event": "setCoinsTrigger",
      "amount": amount,
      "game": "Battle Royale"
    })
  }
}


// #####################################
// ########### BATTLE ROYALE ###########
// #####################################

function gtagBrStartGame(roomIsPrivate) {
  if(roomIsPrivate === true) {
    dataLayer.push({
      "event": "privateBrTrigger",
      "msg": "User Playing Battle Royale (Private)"
    })
  } else {
    dataLayer.push({
      "event": "publicBrTrigger",
      "msg": "User Playing Battle Royale (Public)"
    })
  }
}


// ######################################
// ###########     1 VS 1     ###########
// ######################################

function gtagOneStartGame(roomIsPrivate) {
  if(roomIsPrivate === true) {
    dataLayer.push({
      "event": "private1v1Trigger",
      "msg": "User Playing 1v1 (Private)"
    })
  } else {
    dataLayer.push({
      "event": "public1v1Trigger",
      "msg": "User Playing 1v1 (Public)"
    })
  }
}