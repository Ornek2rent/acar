/* vehicle-selection.js */

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
  }

  async loadVehicles() {
    try {
      this.showLoading();
      
      // Validate config
      if (!CONFIG?.CARS_API_URL) {
        throw new Error('Missing CARS_API_URL in config');
      }

      const response = await fetch(CONFIG.CARS_API_URL);
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
      : this.state.vehicles.filter(v => v.type === this.state.currentFilter);

    this.elements.grid.innerHTML = filteredVehicles.map(vehicle => `
      <div class="vehicle-card" 
           data-id="${vehicle.id}" 
           data-type="${vehicle.type}">
        <h3>${vehicle.name}</h3>
        <div class="vehicle-details">
          <p>$${vehicle.dailyRate}/day</p>
          <p>${vehicle.seats} seats • ${vehicle.transmission}</p>
        </div>
        <button class="select-btn" 
                data-id="${vehicle.id}"
                aria-selected="${this.state.selectedVehicle === vehicle.id}">
          ${this.state.selectedVehicle === vehicle.id ? '✓ Selected' : 'Select'}
        </button>
      </div>
    `).join('');
  }

  bindEvents() {
    // Filter buttons
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentFilter = btn.dataset.filter;
        this.updateActiveFilter();
        this.renderVehicles();
      });
    });

    // Vehicle selection
    this.elements.grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-btn')) {
        this.selectVehicle(e.target.dataset.id);
      }
    });

    // Retry button
    this.elements.retryBtn?.addEventListener('click', () => this.loadVehicles());
  }

  selectVehicle(vehicleId) {
    this.state.selectedVehicle = vehicleId;
    localStorage.setItem('selectedVehicle', vehicleId);
    
    // Update UI
    document.querySelectorAll('.select-btn').forEach(btn => {
      const isSelected = btn.dataset.id === vehicleId;
      btn.setAttribute('aria-selected', isSelected);
      btn.textContent = isSelected ? '✓ Selected' : 'Select';
    });
    
    this.elements.continueBtn.disabled = false;
    this.elements.continueBtn.setAttribute('aria-disabled', 'false');
  }

  updateActiveFilter() {
    this.elements.filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === this.state.currentFilter;
      btn.setAttribute('aria-pressed', isActive);
      btn.classList.toggle('active', isActive);
    });
  }

  // State visibility handlers
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
    this.elements.grid.innerHTML = `
      <div class="empty-state">
        <p>No vehicles available</p>
      </div>`;
    this.showGrid();
  }
}

// Initialize based on context
if (window.bookingSPA) {
  // SPA mode - called by foundation.js
  window.initVehicleSelection = () => new VehicleSelection();
} else {
  // Standalone mode
  document.addEventListener('DOMContentLoaded', () => new VehicleSelection());
}
