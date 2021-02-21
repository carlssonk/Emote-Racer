let socketAdmin;

function initSocketAdmin() {
  socketAdmin = io();

  socketAdmin.on("getClientsByName", (message) => {
    console.log(message)
  })

}



// Admin message
function emoteFlyby(emote) {
  adminMessage.classList.remove("admin-message-animation")
  setTimeout(function() {
    adminMessage.src = emote
    adminMessage.classList.add("admin-message-animation")
  }, 100)
  
}

function adminMessages() {

  if(typeof socket === "object") {

    socket.on("emoteFlyby", (emote) => {
      emoteFlyby(emote)
    });

    socket.on("sendCoins", (amount) => {
      setCoins(amount, superSecretKeyToAccessUnlimitedAmountOfMoney.code)
    });

    socket.on("clearCoins", () => {
      clearCoins(superSecretKeyToAccessUnlimitedAmountOfMoney.code)
    });

  }

}