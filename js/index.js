// index.js

document.addEventListener("DOMContentLoaded", () => {
  const waitForElements = setInterval(() => {
    const darkModeBtn = document.getElementById("darkModeToggle");
    const bookingForm = document.getElementById("bookingForm");

    if (darkModeBtn && bookingForm) {
      clearInterval(waitForElements);

      // Dark/Light Toggle
      darkModeBtn.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
      });

      // Form Submission
      bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Capture form data
        const bookingData = {
          pickupLocation: document.getElementById("pickupLocation").value.trim(),
          pickupDateTime: document.getElementById("pickupDateTime").value,
          returnDateTime: document.getElementById("returnDateTime").value,
          under25: document.getElementById("under25").checked,
        };

        // Save to localStorage for SPA
        localStorage.setItem("preBookingInfo", JSON.stringify(bookingData));

        // Optional: submit to Google Form or endpoint
        this.action = CONFIG.FORM_ENDPOINT;
        this.submit();

        // Wait a moment and redirect into SPA shell
        setTimeout(() => {
          window.location.href = "foundation.html?page=vehicle-selection";
        }, 1000);
      });
    }
  }, 100); // Check every 100ms
});
