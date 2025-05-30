// js/foundation.js

window.bookingSPA = true;
window.bookingData = window.bookingData || {};

const appRoot = document.getElementById('app');

// Map routes to Postman entries
const ROUTES = {
  vehicle: {
    html: Postman.VEHICLE_SELECTION_HTML,
    js: Postman.VEHICLE_SELECTION_JS,
    initFn: 'initVehicleSelection'
  },
  extras: {
    html: Postman.EXTRAS_HTML,
    js: Postman.EXTRAS_JS,
    initFn: 'initExtras'
  },
  payment: {
    html: Postman.DETAILS_PAYMENT_HTML,
    js: Postman.DETAILS_PAYMENT_JS,
    initFn: 'initDetailsPayment'
  },
  thankyou: {
    html: Postman.THANK_YOU_HTML,
    js: Postman.THANK_YOU_JS,
    initFn: 'initThankYou'
  }
};

const DEFAULT_PAGE = 'vehicle';

function loadSPAView(page) {
  const route = ROUTES[page] || ROUTES[DEFAULT_PAGE];

  if (!route) return console.error('Invalid route:', page);

  // Load HTML fragment into #app
  fetch(route.html)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${route.html}`);
      return res.text();
    })
    .then(html => {
      appRoot.innerHTML = html;

      // Load and run page-specific JS
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
  // Prevent reloading if already loaded
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

function loadComponent(selector, url) {
  fetch(url)
    .then(res => res.ok ? res.text() : '')
    .then(html => {
      const container = document.querySelector(selector);
      if (container) container.innerHTML = html;
    })
    .catch(err => console.warn(`Failed to load ${url}:`, err));
}

function initSPA() {
  // Load header and footer
  loadComponent('#header-container', 'components/header.html');
  loadComponent('#footer-container', 'components/footer.html');

  // Load initial view
  const params = new URLSearchParams(window.location.search);
  const initialPage = params.get('page') || DEFAULT_PAGE;
  loadSPAView(initialPage);

  // Handle link clicks and browser back/forward
  document.body.addEventListener('click', handleLinkClicks);
  window.addEventListener('popstate', handlePopState);
}

document.addEventListener('DOMContentLoaded', initSPA);
