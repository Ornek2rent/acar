// foundation.js

class VehicleSelection {
  constructor() {
    this.state = {
      selectedVehicle: localStorage.getItem('selectedVehicle') || null,
      vehicles: [],
      currentFilter: 'all'
    };

    this.elements = {
      grid: document.getElementById('vehicleList'),
      loading: document.getElementById('loadingIndicator'),
      error: document.getElementById('errorDisplay'),
      retryBtn: document.getElementById('retryButton'),
      continueBtn: document.getElementById('continueBtn'),
      filterButtons: document.querySelectorAll('.filter-btn')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadVehicles();
    this.updateContinueBtnState();
  }

  async loadVehicles() {
    try {
      this.showLoading();

      // Use postman.js API url, fallback to config
      const carsApiUrl = window.postman?.api?.CARS_API_URL || CONFIG?.CARS_API_URL;
      if (!carsApiUrl) throw new Error('Missing CARS_API_URL in config or postman');

      const response = await fetch(carsApiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.state.vehicles = await response.json();

      if (this.state.vehicles.length === 0) {
        this.showEmptyState();
      } else {
        this.renderVehicles();
        this.showGrid();
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      this.showError();
    }
  }

  renderVehicles() {
    const filteredVehicles = this.state.currentFilter === 'all'
      ? this.state.vehicles
      : this.state.vehicles.filter(v => v.Type === this.state.currentFilter);

    this.elements.grid.innerHTML = filteredVehicles.map(vehicle => `
      <div class="vehicle-card" 
           data-id="${vehicle["Car ID"]}" 
           data-type="${vehicle["Type"] || 'default'}">
        <h3>${vehicle["Name"]} ${vehicle["Model"]}</h3>
        <div class="vehicle-details">
          <p>$${vehicle["Daily Rate"]}/day</p>
          <p>${vehicle["Seats"]} seats • ${vehicle["Transmission"]}</p>
        </div>
        <button class="select-btn" 
                data-id="${vehicle["Car ID"]}"
                aria-selected="${this.state.selectedVehicle === vehicle["Car ID"]}">
          ${this.state.selectedVehicle === vehicle["Car ID"] ? '✓ Selected' : 'Select'}
        </button>
      </div>
    `).join('');
  }

  bindEvents() {
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentFilter = btn.dataset.filter;
        this.updateActiveFilter();
        this.renderVehicles();
      });
    });

    this.elements.grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-btn')) {
        this.selectVehicle(e.target.dataset.id);
      }
    });

    this.elements.retryBtn?.addEventListener('click', () => this.loadVehicles());

    this.elements.continueBtn?.addEventListener('click', () => {
      if (this.state.selectedVehicle) {
        // Use SPA navigation via bookingSPA.loadPage instead of window.location.href
        if (window.bookingSPA && typeof window.bookingSPA.loadPage === 'function') {
          window.bookingSPA.loadPage('extras');
        } else {
          window.location.href = window.postman?.pages?.extras || 'extras.html';
        }
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

    this.updateContinueBtnState();
  }

  updateContinueBtnState() {
    if (this.elements.continueBtn) {
      const enabled = !!this.state.selectedVehicle;
      this.elements.continueBtn.disabled = !enabled;
      this.elements.continueBtn.setAttribute('aria-disabled', (!enabled).toString());
    }
  }

  updateActiveFilter() {
    this.elements.filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === this.state.currentFilter;
      btn.setAttribute('aria-pressed', isActive);
      btn.classList.toggle('active', isActive);
    });
  }

  showLoading() {
    if (this.elements.loading) this.elements.loading.style.display = 'block';
    if (this.elements.grid) this.elements.grid.style.display = 'none';
    if (this.elements.error) this.elements.error.style.display = 'none';
  }

  showGrid() {
    if (this.elements.loading) this.elements.loading.style.display = 'none';
    if (this.elements.grid) this.elements.grid.style.display = 'grid';
    if (this.elements.error) this.elements.error.style.display = 'none';
  }

  showError() {
    if (this.elements.loading) this.elements.loading.style.display = 'none';
    if (this.elements.grid) this.elements.grid.style.display = 'none';
    if (this.elements.error) this.elements.error.style.display = 'block';
  }

  showEmptyState() {
    this.elements.grid.innerHTML = `
      <div class="empty-state">
        <p>No vehicles available</p>
      </div>`;
    this.showGrid();
  }
}

if (window.bookingSPA) {
  window.initVehicleSelection = () => new VehicleSelection();
} else {
  document.addEventListener('DOMContentLoaded', () => new VehicleSelection());
}
