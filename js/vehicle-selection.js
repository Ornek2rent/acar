<!-- vehicle-selection.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Select Vehicle</title>

  <link rel="stylesheet" href="css/style.css" />
  <script src="js/config.js" defer></script>
  <script src="js/load-header.js" defer></script>
  <script src="js/vehicle-selection.js" defer></script>
</head>
<body data-theme="light">
  <!-- Modular Header Placeholder -->
  <div id="header-container"></div>

  <main class="vehicle-container">
    <h1>Select Your Vehicle</h1>

    <!-- Loading Indicator -->
    <div id="loadingIndicator" class="loading" aria-live="polite" style="display: none;">
      <p>Loading vehicles...</p>
    </div>

    <!-- Error Message and Retry -->
    <div id="errorDisplay" class="error" style="display: none;">
      <p>Failed to load vehicles. Please try again.</p>
      <button id="retryButton">Retry</button>
    </div>

    <!-- Vehicle Grid -->
    <div id="vehicleList"></div>
  </main>
</body>
</html>
