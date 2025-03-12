// Function to check if user is logged in and redirect if not
function checkUserSession() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser) {
      window.location.href = "index.html";  // Redirect to login page if not logged in
  } else {
      // User is logged in, display PDF management section
      document.getElementById("upload-container").style.display = 'block';
      displayPDFList();
  }
}

// Display uploaded PDFs
function displayPDFList() {
  const pdfListContainer = document.getElementById("pdfList");
  pdfListContainer.innerHTML = "";

  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")); // Get logged-in user

  // Check if the logged-in user has delete authority
  const canDelete = loggedInUser && loggedInUser.username === "9769761579";  // Only this user can delete

  if (storedPDFs.length === 0) {
      pdfListContainer.innerHTML = "<p>No PDFs uploaded yet.</p>";
      return;
  }

  storedPDFs.forEach((pdf, index) => {
      const pdfElement = document.createElement("div");
      pdfElement.classList.add("pdf-item");

      // Append delete button only if the user has delete authority
      const deleteButton = canDelete ? `
          <button class="delete-btn" onclick="deletePDF(${index})">Delete</button>
      ` : '';

      pdfElement.innerHTML = `
          <div class="pdf-details">
              <img src="ncv logo.jpg" alt="PDF Thumbnail" class="file-thumbnail">
              <a href="${pdf.url}" target="_blank">${pdf.name}</a>
          </div>
          <div class="pdf-actions">
              <button class="replace-btn" onclick="replacePDF(${index})">Replace</button>
              ${deleteButton}  <!-- Delete button is conditionally rendered -->
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

// Function to replace a PDF
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

  // Replace the PDF in localStorage
  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs[index] = { name: file.name, url: URL.createObjectURL(file) };
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
  showNotification("✅ PDF replaced successfully!", "#28a745");
  displayPDFList();
}

// Function to delete a PDF (only available for a specific user)
function deletePDF(index) {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (loggedInUser && loggedInUser.username !== "9769761579") {
      showNotification("❌ You do not have permission to delete this PDF.", "#dc3545");
      return;
  }

  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs.splice(index, 1); // Remove PDF from array
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
  showNotification("✅ PDF deleted successfully!", "#28a745");
  displayPDFList();
}

// Function to upload a PDF (stored locally)
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

// Function to save PDF data to localStorage
function savePDFData(name, url) {
  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs.push({ name, url });
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
}

// Function to search through PDFs
function searchPDFs() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const pdfListContainer = document.getElementById("pdfList");
  const pdfItems = pdfListContainer.getElementsByClassName("pdf-item");

  Array.from(pdfItems).forEach((item) => {
      const pdfName = item.querySelector("a").textContent.toLowerCase();
      item.style.display = pdfName.includes(searchInput) ? "block" : "none";
  });
}

// Logout function
function logout() {
  sessionStorage.removeItem("loggedInUser");  // Remove user from session storage
  window.location.href = "index.html";  // Redirect to login page
}

// Run checkUserSession on page load to ensure user is logged in
document.addEventListener("DOMContentLoaded", function() {
  checkUserSession();
  document.getElementById("loginForm").addEventListener("submit", checkLogin);
});
