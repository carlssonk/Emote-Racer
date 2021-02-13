// Get Storage
const getUsername = function(code, newName) {
  let username;

  username = localStorage.getItem("username")

  if(code === "password123") {
    localStorage.setItem("username", newName)
    username = localStorage.getItem("username")
  }

  return username;
}

const getprofileImg = function(code, newImg) {
  let profileImg;

  profileImg = localStorage.getItem("profileImg")

  if(code === "password123") {
    localStorage.setItem("profileImg", newImg)
    profileImg = localStorage.getItem("profileImg")
  }

  return profileImg
}



// // Set Storage
// if(getUsername() === null) localStorage.setItem("username", setUsername());
// if(getprofileImg() === null) localStorage.setItem("profileImg", "https://static-cdn.jtvnw.net/emoticons/v1/1/3.0");









// Username Generator

function setUsername() {
  let id = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `Guest_${id}`;
}
