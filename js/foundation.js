// foundation.js

// Utility: Load subpage HTML into #app
async function loadStep(step) {
  const container = document.getElementById('app');
  container.innerHTML = '<p>Loading...</p>';
  try {
    const response = await fetch(`pages/${step}.html`);
    if (!response.ok) throw new Error('Failed to load page');
    const html = await response.text();
    container.innerHTML = html;
    history.pushState({ step }, '', `?step=${step}`);
  } catch (error) {
    container.innerHTML = '<p>Error loading page. Please try again.</p>';
    console.error(error);
  }
}

// Handle theme switching
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  toggle.checked = currentTheme === 'dark';

  toggle.addEventListener('change', () => {
    const newTheme = toggle.checked ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  });
}

// Get step from URL
function getStepFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('step') || 'vehicle-selection';
}

// Handle back/forward browser navigation
window.addEventListener('popstate', (event) => {
  const step = (event.state && event.state.step) || getStepFromURL();
  loadStep(step);
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  const step = getStepFromURL();
  loadStep(step);
});
