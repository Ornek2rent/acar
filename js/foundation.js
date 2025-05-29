// foundation.js

class BookingSPA {
  constructor() {
    this.currentPage = null;
    this.bookingId = null;
    this.scriptsLoaded = new Set();
    this.init();
  }

  async init() {
    this.setupThemeToggle();
    this.updateBookingId();
    this.setupNavigation();
    await this.loadPage(this.getCurrentPage());
  }

  updateBookingId() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      this.bookingId = urlParams.get('booking') || localStorage.getItem('bookingId');

      if (this.bookingId) {
        localStorage.setItem('bookingId', this.bookingId);
        document.body.dataset.bookingId = this.bookingId;

        const bookingEl = document.getElementById('booking-id');
        if (bookingEl) {
          bookingEl.textContent = `Booking #${this.bookingId}`;
        } else {
          console.warn('#booking-id element not found in DOM');
        }
      }
    } catch (error) {
      console.error('Booking ID update failed:', error);
    }
  }

  setupNavigation() {
    const handleNavigation = (e) => {
      const link = e.target.closest('[data-spa-link]');
      if (link) {
        e.preventDefault();
        this.loadPage(link.dataset.page);
      }
    };

    document.addEventListener('click', handleNavigation);
    document.addEventListener('touchend', handleNavigation);

    window.addEventListener('popstate', (e) => {
      if (e.state?.page) {
        this.loadPage(e.state.page);
      }
    });
  }

  async loadPage(page) {
    if (!page || this.currentPage === page) return;

    try {
      this.showLoadingState();

      const response = await fetch(Postman.getPagePath(page));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();

      document.getElementById('app').innerHTML = html;
      this.currentPage = page;

      await this.loadPageScript(page);

      history.pushState({ page }, '', `?page=${page}`);
    } catch (error) {
      console.error(`Failed loading ${page}:`, error);
      this.showErrorState(page);
    }
  }

  async loadPageScript(page) {
    return new Promise((resolve) => {
      const oldScript = document.getElementById('page-script');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.id = 'page-script';
      script.src = Postman.getScriptPath(page);

      script.onload = () => {
        this.scriptsLoaded.add(page);
        resolve();
      };

      script.onerror = () => {
        console.warn(`Script failed: ${page}.js`);
        resolve();
      };

      document.body.appendChild(script);
    });
  }

  getCurrentPage() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('page') || 'vehicle-selection';
    } catch (error) {
      console.warn('URL parse error, defaulting to vehicle-selection');
      return 'vehicle-selection';
    }
  }

  showLoadingState() {
    document.getElementById('app').innerHTML = `
      <div class="spa-loading">
        <div class="loader"></div>
        <p>Loading ${this.getPageName(this.currentPage)}...</p>
      </div>`;
  }

  showErrorState(page) {
    document.getElementById('app').innerHTML = `
      <div class="error-state">
        <h3>Failed to load ${this.getPageName(page)}</h3>
        <button class="retry-btn" onclick="window.bookingSPA.loadPage('${page}')">
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
}

window.bookingSPA = new BookingSPA();
