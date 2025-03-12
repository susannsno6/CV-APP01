// User database
const users = [
    { username: "NEPAL JOB", password: "Susan Shakya" },
    { username: "9769761579", password: "Puspa Khanal" },
    { username: "9813304961", password: "Srijana Shakya" },
    { username: "9823376008", password: "Lalita Shakya" },
    { username: "Khajuki", password: "Anjana Shakya" },
    { username: "JOB CV", password: "Nepaljobcv@123" }
];

// Function to check login credentials
function checkLogin(event) {
    if (event) event.preventDefault(); // Prevent form submission

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    if (!usernameInput || !passwordInput || !errorMessage) {
        console.error("Error: HTML elements not found!");
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.textContent = "";

    if (!username || !password) {
        errorMessage.textContent = "❌ Please enter both username and password";
        return;
    }

    // Find user (case-insensitive)
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user && user.password === password) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));  // Store user in session storage
        errorMessage.textContent = "✅ Login Successful! Redirecting...";
        errorMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "cv.html";  // Redirect to CV page after successful login
        }, 1000);
    } else {
        errorMessage.textContent = "❌ Invalid Username or Password";
        errorMessage.style.color = "red";
    }
}

// Check if user is already logged in
function checkUserSession() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
        window.location.href = "cv.html";  // If already logged in, redirect to the CV page
    }
}

// Log out function
function logout() {
    sessionStorage.removeItem("loggedInUser");  // Remove user from session storage
    window.location.href = "index.html";  // Redirect to login page
}

// Run checkUserSession() only after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    checkUserSession();  // Check if the user is already logged in
});
