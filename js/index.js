/* index.js */
document.getElementById("bookingForm").addEventListener("submit", function () {
  this.action = CONFIG.FORM_ENDPOINT;
  setTimeout(() => {
    window.location.href = "vehicle-selection.html";
  }, 1000);
});

