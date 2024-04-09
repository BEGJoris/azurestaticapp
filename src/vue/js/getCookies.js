export function getCookie() {
    const cookies = document.cookie.split(',');

  let userId = null;
  let userType = null;

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [key, value] = cookie.split('=');
    if (key === "userId") {
      userId = value;
    } else if (key === "type") {
      userType = value;
    }
  }
  return { userId, userType };
}

