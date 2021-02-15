let socketAdmin;

function initSocketAdmin() {
  socketAdmin = io();


  socketAdmin.on("getClientsByName", (message) => {
    console.log(message)
  })


}