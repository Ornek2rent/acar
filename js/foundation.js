// js/foundation.js

document.addEventListener("DOMContentLoaded", async () => {
  const query = new URLSearchParams(window.location.search);
  const page = query.get("page") || "vehicle-selection";

  const app = document.getElementById("app");

  try {
    // Load header
    const headerRes = await fetch(Postman.get("components/header.html"));
    document.getElementById("header-container").innerHTML = await headerRes.text();

    // Load footer
    const footerRes = await fetch(Postman.get("components/footer.html"));
    document.getElementById("footer-container").innerHTML = await footerRes.text();

    // Load main content
    const htmlRes = await fetch(Postman.get(`pages/${page}.html`));
    const html = await htmlRes.text();
    app.innerHTML = html;

    // Load associated script
    const script = document.createElement("script");
    script.src = Postman.get(`js/${page}.js`);
    script.defer = true;
    document.body.appendChild(script);
  } catch (err) {
    console.error("Error loading page:", err);
    app.innerHTML = `<p class="error">Failed to load page. Please try again later.</p>`;
  }
});
