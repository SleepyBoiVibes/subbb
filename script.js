document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const navLogin = document.getElementById("nav-login");
    const navManager = document.querySelector("a[href='../Manager/manager.html']");
    const managerAccount = { email: "manager@lonestar.com" };

    if(navLogin){
        if(loggedInUser){
            navLogin.textContent = "ACCOUNT";
            navLogin.href = "/Final-Project/Account/account.html";
        } else {
            navLogin.textContent = "LOGIN / SIGNUP";
            navLogin.href = "/Final-Project/Login-SignUp/login-signUp.html";
        }
    }

    if(navManager){
        navManager.style.display = loggedInUser && loggedInUser.email.toLowerCase() === managerAccount.email ? "block" : "none";
    }

    if(loggedInUser && window.location.pathname.toLowerCase().includes("login-signup.html")){
        window.location.href = loggedInUser.email.toLowerCase() === "manager@lonestar.com" ? '../Manager/manager.html' : '../Account/account.html';
    }
});