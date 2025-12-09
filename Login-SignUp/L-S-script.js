const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
const users = [...storedUsers];

// Add manager account if not present
if(!users.find(u => u.email.toLowerCase() === "manager@lonestar.com")){
    users.push({ name: "manager", email:"manager@lonestar.com", password:"manager123" });
    localStorage.setItem('users', JSON.stringify(users));
}

// Message box for alerts
const messageBox = document.createElement('div');
messageBox.id = 'message';
document.body.appendChild(messageBox);

function showMessage(text, duration=1000){
    messageBox.textContent = text;
    messageBox.classList.add('show');
    messageBox.classList.remove('hide');
    setTimeout(() => {
        messageBox.classList.remove('show');
        messageBox.classList.add('hide');
    }, duration);
}

const signUpForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Handle sign-up
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signUpForm.querySelector('input[placeholder="Name"]').value.trim();
    const email = signUpForm.querySelector('input[placeholder="Email"]').value.trim();
    const password = signUpForm.querySelector('input[placeholder="Password"]').value.trim();

    if(users.find(u => u.email.toLowerCase() === email.toLowerCase())){
        showMessage('This email is already registered');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Account created successfully.');
    signUpForm.reset();
    setTimeout(() => container.classList.remove('right-panel-active'), 1000);
});

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[placeholder="Email"]').value.trim();
    const password = loginForm.querySelector('input[placeholder="Password"]').value.trim();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if(user){
        // Manager password is case-insensitive
        if(user.email.toLowerCase() === "manager@lonestar.com" ? password.toLowerCase() === user.password.toLowerCase() : password === user.password){
            userLoggedIn(user);
        } else {
            showMessage('Invalid email or password.');
        }
    } else {
        showMessage('Invalid email or password.');
    }
});

// Login success
function userLoggedIn(user){
    showMessage(`Welcome back, ${user.name}.`);
    loginForm.reset();
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    setTimeout(() => {
        window.location.href = user.email.toLowerCase() === "manager@lonestar.com"
            ? '../Manager/manager.html'
            : '../account/account.html';
    }, 1000);
}

// Redirect logged-in users from login page
window.addEventListener('load', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoginPage = window.location.pathname.toLowerCase().includes("login-signup.html");

    if(loggedInUser && isLoginPage){
        window.location.href = loggedInUser.email.toLowerCase() === "manager@lonestar.com"
            ? '../Manager/manager.html'
            : '../account/account.html';
    }

    // Default to sign-up view
    container.classList.add('right-panel-active');
});