// User database
const users = [
    { username: "NEPAL JOB", password: "Susan Shakya" },
    { username: "9769761579", password: "Puspa Khanal" },
    { username: "9813304961", password: "Srijana Shakya" },
    { username: "9823376008", password: "Lalita Shakya" },
    { username: "Khajuki", password: "Anjana Shakya" },
    { username: "JOB CV", password: "Nepaljobcv@123" }
];

// Check login credentials
function checkLogin(event) {
    if (event) event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorMessage.textContent = "";

    if (!username || !password) {
        errorMessage.textContent = "❌ Please enter both username and password";
        return;
    }

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user && user.password === password) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        errorMessage.textContent = "✅ Login Successful! Redirecting...";
        errorMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "cv.html";
        }, 1000);
    } else {
        errorMessage.textContent = "❌ Invalid Username or Password";
        errorMessage.style.color = "red";
    }
}

// Check if user is logged in
function checkUserSession() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
        document.querySelector('.login-box').style.display = 'none';
        document.getElementById('upload-container').style.display = 'block';  // Show upload section
        displayPDFList();
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";  // Redirect to login page
}

// Display uploaded PDFs
function displayPDFList() {
    const pdfListContainer = document.getElementById("pdfList");
    pdfListContainer.innerHTML = "";

    let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];

    if (storedPDFs.length === 0) {
        pdfListContainer.innerHTML = "<p>No PDFs uploaded yet.</p>";
        return;
    }

    storedPDFs.forEach((pdf, index) => {
        const pdfElement = document.createElement("div");
        pdfElement.classList.add("pdf-item");

        pdfElement.innerHTML = `
            <div class="pdf-details">
                <img src="ncv logo.jpg" alt="PDF Thumbnail" class="file-thumbnail">
                <a href="${pdf.url}" target="_blank">${pdf.name}</a>
            </div>
            <div class="pdf-actions">
                <button class="replace-btn" onclick="replacePDF(${index})">Replace</button>
                <button class="delete-btn" onclick="deletePDF(${index})">Delete</button>
            </div>
        `;

        pdfListContainer.appendChild(pdfElement);
    });
}

// Show notifications
function showNotification(message, color) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.backgroundColor = color;
}

// Upload PDF
async function uploadPDF() {
    const pdfInput = document.getElementById("pdfInput");

    if (pdfInput.files.length === 0) {
        showNotification("❌ Please select a PDF file to upload.", "#dc3545");
        return;
    }

    const file = pdfInput.files[0];

    if (file.type !== "application/pdf") {
        showNotification("❌ Only PDF files are allowed.", "#dc3545");
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
        showNotification("❌ File size must be less than 10MB.", "#dc3545");
        return;
    }

    showNotification("Uploading...", "#ffc107");

    try {
        const pdfURL = URL.createObjectURL(file); // Create a URL for the local file
        savePDFData(file.name, pdfURL);
        showNotification("✅ Upload successful!", "#28a745");
        displayPDFList();
    } catch (error) {
        showNotification(`❌ ${error.message}`, "#dc3545");
    }
}

// Save PDF data in localStorage
function savePDFData(name, url) {
    let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
    storedPDFs.push({ name, url });
    localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
}

// Replace PDF
async function replacePDF(index) {
    const pdfInput = document.getElementById("pdfInput");

    if (pdfInput.files.length === 0) {
        showNotification("❌ Please select a PDF file to replace.", "#dc3545");
        return;
    }

    const file = pdfInput.files[0];

    if (file.type !== "application/pdf") {
        showNotification("❌ Only PDF files are allowed.", "#dc3545");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showNotification("❌ File size must be less than 10MB.", "#dc3545");
        return;
    }

    let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
    storedPDFs[index] = { name: file.name, url: URL.createObjectURL(file) };
    localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
    showNotification("✅ PDF replaced successfully!", "#28a745");
    displayPDFList();
}

// Delete PDF
function deletePDF(index) {
    let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
    storedPDFs.splice(index, 1); // Remove PDF from array
    localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
    showNotification("✅ PDF deleted successfully!", "#28a745");
    displayPDFList();
}

// Search PDFs
function searchPDFs() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const pdfListContainer = document.getElementById("pdfList");
    const pdfItems = pdfListContainer.getElementsByClassName("pdf-item");

    Array.from(pdfItems).forEach((item) => {
        const pdfName = item.querySelector("a").textContent.toLowerCase();
        item.style.display = pdfName.includes(searchInput) ? "block" : "none";
    });
}

// Load user session and display PDFs
document.addEventListener("DOMContentLoaded", function() {
    checkUserSession();
    document.getElementById("loginForm").addEventListener("submit", checkLogin);
});
