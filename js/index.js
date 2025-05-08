// index.js //

// Form submission
document.getElementById("bookingForm").addEventListener("submit", function () {
  this.action = CONFIG.FORM_ENDPOINT;
  setTimeout(() => {
    window.location.href = "vehicle-selection.html";
  }, 1000);
});

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("themeToggle");
  const body = document.body;

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  // Theme toggle button handler
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    });
  }
});
