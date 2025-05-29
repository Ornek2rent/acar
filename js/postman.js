// postman.js

const Postman = {
  // HTML Pages
  INDEX_HTML: 'index.html',
  FOUNDATION_HTML: 'foundation.html',

  // SPA Pages
  VEHICLE_SELECTION_HTML: 'pages/vehicle-selection.html',
  EXTRAS_HTML: 'pages/extras.html',
  DETAILS_PAYMENT_HTML: 'pages/details-payment.html',
  THANKYOU_HTML: 'pages/thankyou.html',

  // Components
  HEADER_HTML: 'components/header.html',
  FOOTER_HTML: 'components/footer.html',

  // JavaScript Files
  CONFIG_JS: 'js/config.js',
  FOUNDATION_JS: 'js/foundation.js',
  POSTMAN_JS: 'js/postman.js',
  VEHICLE_SELECTION_JS: 'js/vehicle-selection.js',
  EXTRAS_JS: 'js/extras.js',
  DETAILS_PAYMENT_JS: 'js/details-payment.js',
  LOAD_HEADER_JS: 'js/load-header.js',
  THANKYOU_JS: 'js/thankyou.js',

  // Stylesheets
  GLOBAL_CSS: 'css/style.css',

  // GAS Backend Files (not used in client but listed for completeness)
  BACKEND_GS: 'GAS backend/backend.gs',
  CARS_GS: 'GAS backend/cars.gs',

  // Utility
  get(path) {
    return Postman[path] || path;
  }
};
