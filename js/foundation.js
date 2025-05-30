// js/foundation.js

window.bookingSPA = true;
window.bookingData = window.bookingData || {};

const appRoot = document.getElementById('app');

// Map routes to POSTMAN entries
const ROUTES = {
  vehicle: {
    html: POSTMAN.VEHICLE_SELECTION_HTML,
    js: POSTMAN.VEHICLE_SELECTION_JS,
    initFn: 'initVehicleSelection'
  },
  extras: {
    html: POSTMAN.EXTRAS_HTML,
    js: POSTMAN.EXTRAS_JS,
    initFn: 'initExtras'
  },
  payment: {
    html: POSTMAN.DETAILS_PAYMENT_HTML,
    js: POSTMAN.DETAILS_PAYMENT_JS,
    initFn: 'initDetailsPayment'
  },
  thankyou: {
    html: POSTMAN.THANK_YOU_HTML,
    js: POSTMAN.THANK_YOU_JS,
    initFn: 'initThankYou'
  }
};

// Default route if none specified
const DEFAULT_PAGE = 'vehicle';

function loadSPAView(page) {
  const route = ROUTES[page] || ROUTES[DEFAULT_PAGE];

  if (!route) return console.error('Invalid route:', page);

  // Load HTML fragment
  fetch(route.html)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${route.html}`);
      return res.text();
    })
    .then(html => {
      appRoot.innerHTML = html;
      // Load and run script
      loadScript(route.js, () => {
        const initFn = window[route.initFn];
        if (typeof initFn === 'function') {
          initFn();
        } else {
          console.warn(`Missing init function: ${route.initFn}`);
        }
      });
    })
    .catch(err => {
      console.error('SPA load error:', err);
      appRoot.innerHTML = `<p class="error">Something went wrong loading the page.</p>`;
    });
}

function loadScript(src, callback) {
  // Prevent re-loading if already in <head>
  if (document.querySelector(`script[src="${src}"]`)) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onload = callback;
  script.onerror = () => console.error(`Failed to load script: ${src}`);
  document.head.appendChild(script);
}

function handleLinkClicks(e) {
  const link = e.target.closest('[data-spa-link]');
  if (!link) return;

  const page = link.dataset.spaLink;
  if (!page || !ROUTES[page]) return;

  e.preventDefault();
  const url = `foundation.html?page=${page}`;
  history.pushState({ page }, '', url);
  loadSPAView(page);
}

function handlePopState(e) {
  const page = e.state?.page || DEFAULT_PAGE;
  loadSPAView(page);
}

function initSPA() {
  // Handle initial load
  const params = new URLSearchParams(window.location.search);
  const initialPage = params.get('page') || DEFAULT_PAGE;
  loadSPAView(initialPage);

  // Event listeners
  document.body.addEventListener('click', handleLinkClicks);
  window.addEventListener('popstate', handlePopState);
}

document.addEventListener('DOMContentLoaded', initSPA);
