
  function checkLoginStatus() {
    const cookies = document.cookie.split(',').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    if (cookies.userId) {
      if (cookies.type === 'admin') {
        document.getElementById('headerAdmin').classList.remove('hidden');
      } else {
        document.getElementById('headerConnected').classList.remove('hidden');
      }
    } else {
      document.getElementById('headerDisconnected').classList.remove('hidden');
    }
  }

  window.onload = function() {
    checkLoginStatus();
    const logoutButtonAdmin = document.getElementById('logoutButtonAdmin');
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
    if (logoutButtonAdmin) {
      logoutButtonAdmin.addEventListener('click', logoutAdmin);
    }
  };

  function logout(event) {
    event.preventDefault();
    eraseCookie('userId');
    window.top.location.href = './index.html';
  }

  function logoutAdmin(event) {
    event.preventDefault();
    eraseCookie('userId');
    eraseCookie('type');
    window.top.location.href = './index.html';
  }

  function eraseCookie(name) {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  }