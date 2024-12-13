function fetchBuildingFeatures() {
  const token = localStorage.getItem('token');

  $.ajax({
    url: 'https://miniproject-2024.ue.r.appspot.com/building-features',
    method: 'GET',
    headers: token ? { 'token': token } : {}, // add token in header if it exists
    success: function(featureEntities) {
      const buildingFeaturesList = $('#building-features');
      buildingFeaturesList.empty(); // Clear existing items
      
      featureEntities.forEach(feature => {
        if (feature.name) {
          buildingFeaturesList.append(`<li><a href="buildingfeature.html?id=${feature.id}">${feature.name}</a></li>`);
        }
      });
    },
    error: function(xhr) {
      console.error('Failed to fetch features:', xhr);
      $('#building-features').html('<li>No building features were found.</li>');
    }
  });
}

function fetchHousingUnitFeatures() {
  const token = localStorage.getItem('token');

  $.ajax({
    url: 'https://miniproject-2024.ue.r.appspot.com/housing-unit-features',
    method: 'GET',
    headers: token ? { 'token': token } : {}, // add token in header if it exists
    success: function(featureEntities) {
      const housingUnitFeaturesList = $('#housing-unit-features');
      housingUnitFeaturesList.empty(); // Clear existing items
      
      featureEntities.forEach(feature => {
        if (feature.name) {
          housingUnitFeaturesList.append(`<li><a href="housingunitfeature.html?id=${feature.id}">${feature.name}</a></li>`);
        }
      });
    },
    error: function(xhr) {
      console.error('Failed to fetch features:', xhr);
      $('#housing-unit-features').html('<li>No housing unit features were found.</li>');
    }
  });
}
