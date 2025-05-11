/* vehicle-selection.js */

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("vehicleList");
  const body = document.body;
  const toggleButton = document.getElementById("themeToggle");

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }
  if (toggleButton) {
    toggleButton.checked = savedTheme === "dark";
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    });
  }

  // Fetch available vehicles from Google Apps Script
  fetch(CONFIG.CARS_ENDPOINT)
    .then(res => res.json())
    .then(vehicles => {
      if (vehicles.length === 0) {
        list.innerHTML = "<p>No vehicles available at the moment.</p>";
        return;
      }

      vehicles.forEach(vehicle => {
        const div = document.createElement("div");
        div.className = "vehicle-card";
        div.innerHTML = `
          <h3>${vehicle.Make} ${vehicle.Model}</h3>
          <p>Seats: ${vehicle.Seats}</p>
          <button onclick="location.href='extras.html'">Select</button>
        `;
        list.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error loading vehicles:", error);
      list.innerHTML = "<p>Failed to load vehicles. Please try again later.</p>";
    });
});
