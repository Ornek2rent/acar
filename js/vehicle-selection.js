// vehicle-selection.js

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("vehicleList");
  const toggleButton = document.getElementById("themeToggle");
  const body = document.body;

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    if (toggleButton) toggleButton.checked = true;
  }

  // Theme toggle button handler
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    });
  }

  // Load vehicles from API
  fetch(CONFIG.CARS_API_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((vehicles) => {
      if (!Array.isArray(vehicles)) throw new Error("Invalid data format");

      if (vehicles.length === 0) {
        list.innerHTML = "<p>No available vehicles.</p>";
        return;
      }

      vehicles.forEach((vehicle) => {
        const div = document.createElement("div");
        div.classList.add("vehicle-card");
        div.innerHTML = `
          <h3>${vehicle.Make} ${vehicle.Model}</h3>
          <p>Type: ${vehicle.Type}</p>
          <p>Seats: ${vehicle.Seats}</p>
          <p>Daily Rate: $${vehicle.Rate}</p>
          <button onclick="location.href='extras.html'">Select</button>
        `;
        list.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Error loading vehicles:", err);
      list.innerHTML = "<p>Failed to load vehicles. Please try again later.</p>";
    });
});
