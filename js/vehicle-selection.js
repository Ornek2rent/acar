/* vehicle-selection.js */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("vehicleList");

  fetch(CONFIG.CARS_API_URL)
    .then(response => response.json())
    .then(vehicles => {
      list.innerHTML = "";

      if (vehicles.length === 0) {
        list.innerHTML = "<p>No available vehicles.</p>";
        return;
      }

      vehicles.forEach(vehicle => {
        const div = document.createElement("div");
        div.classList.add("vehicle-card");
        div.innerHTML = `
          <h2>${vehicle.Name} (${vehicle.Model})</h2>
          <p><strong>Year:</strong> ${vehicle.Year}</p>
          <p><strong>Color:</strong> ${vehicle.Color}</p>
          <p><strong>Seats:</strong> ${vehicle["Seats"]}</p>
          <p><strong>Daily Rate:</strong> $${vehicle["Daily Rate"]}</p>
          <p><strong>Chassis No.:</strong> ${vehicle["Chassis Number"]}</p>
          <p><strong>Plate No.:</strong> ${vehicle["Plate Number"]}</p>
          <p><strong>Fuel (L):</strong> ${vehicle["Fuel (L)"]}</p>
          <p><strong>Baggage:</strong> ${vehicle["Baggage"]}</p>
          <p><strong>Transmission:</strong> ${vehicle["Transmission"]}</p>
          <p><strong>Fuel Type:</strong> ${vehicle["Fuel Type"]}</p>
          <p><strong>Kilometers:</strong> ${vehicle["Kilometers"]}</p>
          <p><strong>Insurance No.:</strong> ${vehicle["Insurance No."]}</p>
          <button onclick="location.href='extras.html'">Select</button>
        `;
        list.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error loading vehicles:", error);
      list.innerHTML = "<p>Failed to load vehicles. Please try again later.</p>";
    });

  // Theme toggle
  const toggleButton = document.getElementById("themeToggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark");
  if (toggleButton) {
    toggleButton.checked = savedTheme === "dark";
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    });
  }
});
