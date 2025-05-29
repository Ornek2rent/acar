// foundation.js

const SPA = {
  currentView: null,
  viewCleanup: null, // for teardown functions

  async loadView(filePath) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">Loading...</div>';

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);

      const html = await response.text();
      app.innerHTML = html;

      if (SPA.viewCleanup) {
        SPA.viewCleanup(); // Clean up previous view
        SPA.viewCleanup = null;
      }

      SPA.runViewScript(filePath);

    } catch (err) {
      app.innerHTML = `
        <div class="error">
          <p>Something went wrong.</p>
          <pre>${err.message}</pre>
        </div>`;
      console.error(err);
    }
  },

  runViewScript(filePath) {
    const pageKey = filePath.split('/').pop().replace('.html', '');
    const scriptPath = `js/${pageKey}.js`;

    const script = document.createElement('script');
    script.src = scriptPath;
    script.defer = true;

    script.onload = () => {
      if (typeof window[`init${SPA.capitalize(pageKey)}`] === 'function') {
        SPA.viewCleanup = window[`init${SPA.capitalize(pageKey)}`]();
      }
    };

    document.head.appendChild(script);
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  navigateTo(path, pushState = true) {
    if (pushState) window.history.pushState({ path }, '', path);
    SPA.route(path);
  },

  route(path) {
    switch (path) {
      case '/vehicle-selection':
        SPA.loadView(POSTMAN.VEHICLE_SELECTION_HTML);
        break;
      case '/extras':
        SPA.loadView(POSTMAN.EXTRAS_HTML);
        break;
      case '/payment':
        SPA.loadView(POSTMAN.DETAILS_PAYMENT_HTML);
        break;
      case '/thankyou':
        SPA.loadView(POSTMAN.THANKYOU_HTML);
        break;
      default:
        SPA.loadView(POSTMAN.VEHICLE_SELECTION_HTML);
    }
  },

  init() {
    window.bookingSPA = true;

    // Handle popstate
    window.addEventListener('popstate', e => {
      SPA.route(e.state?.path || '/vehicle-selection');
    });

    // Delegate SPA links
    document.body.addEventListener('click', e => {
      const link = e.target.closest('[data-spa-link]');
      if (link) {
        e.preventDefault();
        SPA.navigateTo(link.getAttribute('href'));
      }
    });

    // Initial route
    SPA.route(window.location.pathname);
  }
};

document.addEventListener('DOMContentLoaded', SPA.init);
