/* foundation.js */

class BookingSPA {
  constructor() {
    this.currentPage = null;
    this.scriptsLoaded = new Set();
    this.init();
  }

  async init() {
    this.setupThemeToggle();
    this.setupNavigation();
    await this.loadPage(this.getCurrentPage());
  }

  async loadPage(page) {
    try {
      if (!page || typeof page !== 'string') {
        throw new Error(`Invalid page requested: ${page}`);
      }

      this.showLoadingState();
      
      // Load HTML
      const response = await fetch(`pages/${page}.html`);
      if (!response.ok) throw new Error(`Failed to load ${page}.html`);
      const html = await response.text();
      
      // Inject content
      document.getElementById('app').innerHTML = html;
      this.currentPage = page;
      
      // Load JS
      await this.loadPageScript(page);
      
      // Update history
      history.pushState({ page }, '', `?page=${page}`);
      
    } catch (error) {
      console.error('Page load error:', error);
      this.showErrorState();
    }
  }

  async loadPageScript(page) {
    return new Promise((resolve) => {
      // Cleanup previous script
      const oldScript = document.getElementById('page-script');
      if (oldScript) oldScript.remove();

      // Create new script
      const script = document.createElement('script');
      script.id = 'page-script';
      script.src = `js/${page}.js`;
      
      script.onload = () => {
        if (window[`init${this.camelCase(page)}`]) {
          window[`init${this.camelCase(page)}`]();
        }
        resolve();
      };
      
      script.onerror = () => {
        console.warn(`Script failed to load: ${page}.js`);
        resolve();
      };
      
      document.body.appendChild(script);
    });
  }

  camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    toggle.checked = localStorage.getItem('theme') === 'dark';
    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  }

  setupNavigation() {
    const handleSPAClick = (e) => {
      const link = e.target.closest('[data-spa-link]');
      if (link && !e.defaultPrevented) {
        e.preventDefault();
        this.loadPage(link.dataset.page);
      }
    };

    document.addEventListener('click', handleSPAClick);
    document.addEventListener('touchend', handleSPAClick);

    window.addEventListener('popstate', (e) => {
      if (e.state?.page) {
        this.loadPage(e.state.page);
      }
    });
  }

  getCurrentPage() {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'vehicle-selection';
  }

  showLoadingState() {
    document.getElementById('app').innerHTML = `
      <div class="spa-loading">
        <div class="loader"></div>
        <p>Loading ${this.getPageName(this.getCurrentPage())}...</p>
      </div>`;
  }

  showErrorState() {
    document.getElementById('app').innerHTML = `
      <div class="error-state">
        <h3>Failed to load page</h3>
        <button class="retry-btn" onclick="window.bookingSPA.loadPage('${this.currentPage}')">
          Retry
        </button>
      </div>`;
  }

  getPageName(page) {
    const names = {
      'vehicle-selection': 'Vehicle Selection',
      'extras': 'Extra Services',
      'details-payment': 'Payment',
      'thankyou': 'Confirmation'
    };
    return names[page] || 'Page';
  }
}

// Initialize
window.bookingSPA = new BookingSPA();
