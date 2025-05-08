/* vehicle-selection.js */
const vehicles = ["Sedan", "SUV", "Convertible"];
const list = document.getElementById("vehicleList");
vehicles.forEach(vehicle => {
  const div = document.createElement("div");
  div.innerHTML = `${vehicle} <button onclick="location.href='extras.html'">Select</button>`;
  list.appendChild(div);
});
