(function() {
    const token = localStorage.getItem("token");
    const isLoginPage = window.location.pathname.endsWith("login.html");

    console.log("Auth Guard Check:", { 
        hasToken: !!token, 
        isLoginPage, 
        path: window.location.pathname 
    });

    if (!token && !isLoginPage) {
        console.warn("No auth token found. Redirecting to login...");
        window.location.href = "login.html";
    }

    if (token && isLoginPage) {
        console.info("User already logged in. Redirecting to home...");
        window.location.href = "home.html";
    }
})();
