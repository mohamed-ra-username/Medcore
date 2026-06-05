(function() {
    const token = localStorage.getItem("token");
    const isLoginPage = window.location.pathname.includes("login.html");
    if (!token && !isLoginPage) window.location.href = "login.html";
    if (token && isLoginPage) window.location.href = "home.html";
})();
