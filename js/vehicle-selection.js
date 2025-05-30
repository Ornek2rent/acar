/* vehicle-selection.js */
/* lalalatest */

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

      if (!CONFIG?.CARS_API_URL) throw new Error('Missing CONFIG.CARS_API_URL');

      const response = await fetch(CONFIG.CARS_API_URL);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      this.state.vehicles = data;

      if (!data.length) {
        this.showEmptyState();
      } else {
        this.renderVehicles();
        this.showGrid();
      }

    } catch (error) {
      console.error('Failed to load vehicles:', error);
      this.showError();
    }
  }

  renderVehicles() {
    const html = this.state.vehicles.map(vehicle => {
      const isSelected = this.state.selectedVehicle === vehicle["Car ID"];
      return `
        <div class="vehicle-card" data-id="${vehicle["Car ID"]}">
          <h3>${vehicle["Name"]} ${vehicle["Model"]}</h3>
          <div class="vehicle-details">
            <p>$${vehicle["Daily Rate"]}/day</p>
            <p>${vehicle["Seats"]} seats • ${vehicle["Transmission"]}</p>
          </div>
          <button class="select-btn" 
                  data-id="${vehicle["Car ID"]}" 
                  aria-selected="${isSelected}">
            ${isSelected ? '✓ Selected' : 'Select'}
          </button>
        </div>
      `;
    }).join('');

    this.elements.grid.innerHTML = html;

    if (this.state.selectedVehicle) {
      this.enableContinue();
    }
  }

  bindEvents() {
    this.elements.grid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.select-btn');
      if (btn) {
        this.selectVehicle(btn.dataset.id);
      }
    });

    this.elements.retryBtn?.addEventListener('click', () => this.loadVehicles());

    this.elements.continueBtn?.addEventListener('click', () => {
      if (this.state.selectedVehicle) {
        if (window.bookingData) {
          window.bookingData.vehicle = this.state.selectedVehicle;
        }
        window.history.pushState({}, '', 'foundation.html?page=extras');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });
  }

  selectVehicle(vehicleId) {
    this.state.selectedVehicle = vehicleId;
    localStorage.setItem('selectedVehicle', vehicleId);

    document.querySelectorAll('.select-btn').forEach(btn => {
      const isSelected = btn.dataset.id === vehicleId;
      btn.setAttribute('aria-selected', isSelected);
      btn.textContent = isSelected ? '✓ Selected' : 'Select';
    });

    this.enableContinue();
  }

  enableContinue() {
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
    this.elements.grid.innerHTML = `<div class="empty-state"><p>No vehicles available.</p></div>`;
    this.showGrid();
  }
}

// SPA hook support
if (window.bookingSPA) {
  window.initVehicleSelection = () => new VehicleSelection();
} else {
  document.addEventListener('DOMContentLoaded', () => new VehicleSelection());
}
