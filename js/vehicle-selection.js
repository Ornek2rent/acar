/* vehicle-selection.js */

class VehicleSelection {
  constructor() {
    this.state = {
      selectedVehicle: localStorage.getItem('selectedVehicle') || null,
      vehicles: []
    };

    this.elements = {
      grid: document.getElementById('vehicleList'),
      loading: document.getElementById('loadingIndicator'),
      error: document.getElementById('errorDisplay'),
      retryBtn: document.getElementById('retryButton'),
      continueBtn: document.getElementById('continueBtn')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadVehicles();
  }

  async loadVehicles() {
    try {
      this.showLoading();

      if (!CONFIG?.CARS_API_URL) throw new Error('Missing CARS_API_URL in config');

      const res = await fetch(CONFIG.CARS_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      this.state.vehicles = await res.json();

      if (!this.state.vehicles.length) {
        this.showEmptyState();
      } else {
        this.renderVehicles();
        this.showGrid();
      }

    } catch (err) {
      console.error('Vehicle fetch error:', err);
      this.showError();
    }
  }

  renderVehicles() {
    const html = this.state.vehicles.map(vehicle => {
      const selected = this.state.selectedVehicle === vehicle["Car ID"];
      return `
        <div class="vehicle-card" data-id="${vehicle["Car ID"]}">
          <h3>${vehicle["Name"]} ${vehicle["Model"]}</h3>
          <div class="vehicle-details">
            <p>$${vehicle["Daily Rate"]}/day</p>
            <p>${vehicle["Seats"]} seats • ${vehicle["Transmission"]}</p>
          </div>
          <button class="select-btn" 
                  data-id="${vehicle["Car ID"]}" 
                  aria-selected="${selected}">
            ${selected ? '✓ Selected' : 'Select'}
          </button>
        </div>
      `;
    }).join('');

    this.elements.grid.innerHTML = html;

    // If previously selected, enable continue
    if (this.state.selectedVehicle) {
      this.elements.continueBtn.disabled = false;
      this.elements.continueBtn.setAttribute('aria-disabled', 'false');
    }
  }

  bindEvents() {
    this.elements.grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-btn')) {
        this.selectVehicle(e.target.dataset.id);
      }
    });

    this.elements.retryBtn?.addEventListener('click', () => this.loadVehicles());

    this.elements.continueBtn?.addEventListener('click', () => {
      if (this.state.selectedVehicle) {
        // Save to global booking state if SPA
        if (window.bookingData) {
          window.bookingData.vehicle = this.state.selectedVehicle;
        }
        window.location.href = 'foundation.html?page=extras';
      }
    });
  }

  selectVehicle(vehicleId) {
    this.state.selectedVehicle = vehicleId;
    localStorage.setItem('selectedVehicle', vehicleId);

    // Update all buttons
    document.querySelectorAll('.select-btn').forEach(btn => {
      const isSelected = btn.dataset.id === vehicleId;
      btn.setAttribute('aria-selected', isSelected);
      btn.textContent = isSelected ? '✓ Selected' : 'Select';
    });

    this.elements.continueBtn.disabled = false;
    this.elements.continueBtn.setAttribute('aria-disabled', 'false');
  }

  showLoading() {
    this.elements.loading.style.display = 'block';
    this.elements.grid.style.display = 'none';
    this.elements.error.style.display = 'none';
  }

  showGrid() {
    this.elements.loading.style.display = 'none';
    this.elements.grid.style.display = 'grid';
    this.elements.error.style.display = 'none';
  }

  showError() {
    this.elements.loading.style.display = 'none';
    this.elements.grid.style.display = 'none';
    this.elements.error.style.display = 'block';
  }

  showEmptyState() {
    this.elements.grid.innerHTML = `<div class="empty-state"><p>No vehicles available</p></div>`;
    this.showGrid();
  }
}

// Support both SPA and standalone
if (window.bookingSPA) {
  window.initVehicleSelection = () => new VehicleSelection();
} else {
  document.addEventListener('DOMContentLoaded', () => new VehicleSelection());
}
