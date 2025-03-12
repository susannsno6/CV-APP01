// Function to Display PDFs with Replace & Delete Buttons
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

// Function to Show Notifications
function showNotification(message, color) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor = color;
}

// Function to Replace a PDF
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

  // Save the new file locally and update the stored data
  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs[index] = { name: file.name, url: URL.createObjectURL(file) };  // Use Object URL for local file
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
  showNotification("✅ PDF replaced successfully!", "#28a745");
  displayPDFList();
}

// Function to Delete a PDF
function deletePDF(index) {
  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs.splice(index, 1); // Remove PDF from array
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
  showNotification("✅ PDF deleted successfully!", "#28a745");
  displayPDFList();
}

// Function to Upload PDF (Store locally in browser)
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

  // Create a local object URL and save the PDF details in localStorage
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

// Function to Save PDF URL in localStorage
function savePDFData(name, url) {
  let storedPDFs = JSON.parse(localStorage.getItem("pdfFiles")) || [];
  storedPDFs.push({ name, url });
  localStorage.setItem("pdfFiles", JSON.stringify(storedPDFs));
}

// Search function to filter PDFs
function searchPDFs() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const pdfListContainer = document.getElementById("pdfList");
  const pdfItems = pdfListContainer.getElementsByClassName("pdf-item");

  Array.from(pdfItems).forEach((item) => {
      const pdfName = item.querySelector("a").textContent.toLowerCase();
      item.style.display = pdfName.includes(searchInput) ? "block" : "none";
  });
}

// Load PDFs on page load
document.addEventListener("DOMContentLoaded", displayPDFList);
