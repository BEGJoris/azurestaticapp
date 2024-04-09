function getIdAdmin() {
    const cookies = document.cookie.split(',');
    let userId = null;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const [key, value] = cookie.split('=');
      if (key === "userId") {
        userId = value;
        break;
      }
    }
    return userId; 
  }

window.onload = function() {
  getIdAdmin();
}
