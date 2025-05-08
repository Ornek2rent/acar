/* config.js */
const CONFIG = {
  FORM_ENDPOINT: "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
};

/* index.js */
document.getElementById("bookingForm").addEventListener("submit", function () {
  this.action = CONFIG.FORM_ENDPOINT;
  setTimeout(() => {
    window.location.href = "vehicle-selection.html";
  }, 1000);
});

/* vehicle-selection.js */
const vehicles = ["Sedan", "SUV", "Convertible"];
const list = document.getElementById("vehicleList");
vehicles.forEach(vehicle => {
  const div = document.createElement("div");
  div.innerHTML = `${vehicle} <button onclick="location.href='extras.html'">Select</button>`;
  list.appendChild(div);
});
