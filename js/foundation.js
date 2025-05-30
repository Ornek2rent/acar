// js/foundation.js

window.bookingSPA = true;
window.bookingData = window.bookingData || {};

const appRoot = document.getElementById('app');

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

  if (!route) {
    console.error('Invalid route:', page);
    return;
  }

  fetch(route.html)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${route.html}`);
      return res.text();
    })
    .then(html => {
      appRoot.innerHTML = html;
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
  history.pushState({ page }, '', `foundation.html?page=${page}`);
  loadSPAView(page);
}

function handlePopState(e) {
  const page = e.state?.page || DEFAULT_PAGE;
  loadSPAView(page);
}

function initSPA() {
  const params = new URLSearchParams(window.location.search);
  const initialPage = params.get('page') || DEFAULT_PAGE;
  loadSPAView(initialPage);

  document.body.addEventListener('click', handleLinkClicks);
  window.addEventListener('popstate', handlePopState);
}

document.addEventListener('DOMContentLoaded', initSPA);
