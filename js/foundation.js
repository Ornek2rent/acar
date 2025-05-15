// foundation.js
class BookingSPA {
  constructor() {
    this.currentView = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadView(this.getInitialView());
  }

  async loadView(view) {
    try {
      this.showLoadingState();
      
      // Load HTML
      const html = await fetch(`views/${view}.html`).then(r => r.text());
      document.getElementById('app').innerHTML = html;
      this.currentView = view;
      
      // Load JS
      await this.loadViewScript(view);
      
      // Update URL
      history.pushState({ view }, '', `?view=${view}`);
      
    } catch (error) {
      this.showErrorState();
      console.error(`Failed loading ${view}:`, error);
    }
  }

  async loadViewScript(view) {
    try {
      const module = await import(`./modules/${view}.js`);
      if (module.init) module.init();
    } catch (error) {
      console.warn(`No JS module for ${view}`);
    }
  }

  setupEventListeners() {
    // SPA Navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-spa-link]');
      if (link) {
        e.preventDefault();
        this.loadView(link.dataset.view);
      }
    });

    // Browser navigation
    window.addEventListener('popstate', (e) => {
      this.loadView(e.state?.view || this.getInitialView());
    });
  }

  getInitialView() {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') || 'vehicle-selection';
  }

  showLoadingState() {
    document.getElementById('app').innerHTML = `
      <div class="spa-loading">
        <div class="loader"></div>
      </div>`;
  }

  showErrorState() {
    document.getElementById('app').innerHTML = `
      <div class="error-state">
        <p>Failed to load page</p>
        <button onclick="window.location.reload()">Retry</button>
      </div>`;
  }
}

// Initialize
new BookingSPA();
