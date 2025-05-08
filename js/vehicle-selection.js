/* vehicle-selection.js */

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("vehicleList");
  const body = document.body;
  const toggleButton = document.getElementById("themeToggle");

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    if (toggleButton) toggleButton.checked = true;
  }

  // Theme toggle logic
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    });
  }

  // Load available vehicles from the Google Sheets backend
  fetch(CONFIG.CARS_API_URL)
    .then(res => res.json())
    .then(vehicles => {
      if (vehicles.length === 0) {
        list.innerHTML = "<p>No vehicles currently available.</p>";
        return;
      }

      vehicles.forEach(vehicle => {
        const div = document.createElement("div");
        div.className = "vehicle-item";
        div.innerHTML = `
          <h3>${vehicle.Make} ${vehicle.Model} (${vehicle.Year})</h3>
          <p>Type: ${vehicle.Type}</p>
          <button onclick="location.href='extras.html'">Select</button>
        `;
        list.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error fetching vehicles:", err);
      list.innerHTML = "<p>Failed to load vehicle data.</p>";
    });
});
