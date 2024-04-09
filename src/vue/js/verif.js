function getCookie(name) {
  let cookieArr = document.cookie.split(",");
  for(let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if(name == cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return null;
}
function checkSession() {
  var userId = getCookie("userId");
  if (!userId) {
      window.location.href = './connexion.html';
  }
}

$(document).ready(function() {
  checkSession();
});
