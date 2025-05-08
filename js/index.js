// index.js

// Dark/Light Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", function () {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
});

// Submit the form with a delay
document.getElementById("bookingForm").addEventListener("submit", function () {
  this.action = CONFIG.FORM_ENDPOINT;
  setTimeout(() => {
    window.location.href = "vehicle-selection.html";
  }, 1000);
});
