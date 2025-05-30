// index.js

document.addEventListener("DOMContentLoaded", () => {
  // ===== TESTING DEFAULTS =====
  const setTestDefaults = () => {
    const now = new Date();
    const returnDate = new Date(now);
    returnDate.setDate(now.getDate() + 5);
    
    document.getElementById("pickupLocation").value = "Istanbul";
    document.getElementById("pickupDateTime").value = formatDateTime(now);
    document.getElementById("returnDateTime").value = formatDateTime(returnDate);
    document.getElementById("under25").checked = false;
  };

  const formatDateTime = (date) => date.toISOString().slice(0, 16);

  // ===== ELEMENT INITIALIZATION =====
  const initTimeout = setTimeout(() => {
    console.error("Critical elements failed to load");
  }, 5000);

  const waitForElements = setInterval(() => {
    const darkModeBtn = document.getElementById("darkModeToggle");
    const bookingForm = document.getElementById("bookingForm");

    if (darkModeBtn && bookingForm) {
      clearInterval(waitForElements);
      clearTimeout(initTimeout);
      initializeApp(darkModeBtn, bookingForm);
    }
  }, 100);

  // ===== CORE FUNCTIONALITY =====
  const initializeApp = (darkModeBtn, bookingForm) => {
    // Theme Management
    const currentTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", currentTheme);
    darkModeBtn.checked = currentTheme === "dark";
    
    darkModeBtn.addEventListener("click", () => {
      const newTheme = darkModeBtn.checked ? "dark" : "light";
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });

    // Test Data Injection
    if (window.location.hostname === "localhost" || window.location.search.includes("test=true")) {
      setTestDefaults();
      const testBtn = document.createElement("button");
      testBtn.type = "button";
      testBtn.textContent = "Fill Test Data";
      testBtn.className = "test-btn";
      testBtn.onclick = setTestDefaults;
      bookingForm.querySelector('.form-actions').appendChild(testBtn);
    }

    // Form Handling
    bookingForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const bookingData = {
        pickupLocation: this.pickupLocation.value.trim(),
        pickupDateTime: this.pickupDateTime.value,
        returnDateTime: this.returnDateTime.value,
        under25: this.under25.checked
      };

      // Validation
      if (!bookingData.pickupLocation || !bookingData.pickupDateTime || !bookingData.returnDateTime) {
        alert("Please complete all required fields");
        return;
      }

      // Debug output
      console.table({
        ...bookingData,
        duration: calculateDuration(bookingData.pickupDateTime, bookingData.returnDateTime) + " days"
      });

      // Persist and submit
      localStorage.setItem("preBookingInfo", JSON.stringify(bookingData));
      this.action = CONFIG.FORM_ENDPOINT;
      this.submit();

      // Verified transition
      const transition = setInterval(() => {
        const iframe = document.getElementById("hidden_iframe");
        if (iframe.contentWindow.location.href !== "about:blank") {
          clearInterval(transition);
          window.location.href = `foundation.html?page=vehicle-selection&booking=${Date.now()}`;
        }
      }, 200);
    });
  };

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.max(1, Math.ceil(diff / (86400000))); // 1 day min
  };
});
