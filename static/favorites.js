$(document).ready(function () {

  const token = localStorage.getItem('token');

  console.log("Test");
  getProfile(token);

  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.href = "index.html";
  });

  $('#housing-units-tab').click(function () {
    console.log("housing unit tab clicked");
    activateTab('#housing-units-tab', '#buildings-tab', '#housing-units', '#buildings');
    getFavHousingUnits();
  });
  
  $('#buildings-tab').click(function () {
    console.log("Buildings tab clicked");
    activateTab('#buildings-tab', '#housing-units-tab', '#buildings', '#housing-units');
    getFavBuildings();
  });
});

function activateTab(activeTabId, inactiveTabId, activeContentId, inactiveContentId) {
  $(activeTabId).addClass('active').attr('aria-selected', 'true');
  $(inactiveTabId).removeClass('active').attr('aria-selected', 'false');

  $(activeContentId).addClass('show active');
  $(inactiveContentId).removeClass('show active');
}

function getProfile(token) {
  $.ajax({
		url: 'https://miniproject-2024.ue.r.appspot.com/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
    crossDomain: true,
		success: function(response) {
      localStorage.setItem("userId", response.id);
			$('#user-name').text(response.firstName + " " + response.lastName);
      $('#user-email').text(response.emailAddress);
      getFavBuildings();
		},
		error: function(xhr) {
			// Handle different error scenarios
      switch (xhr.status) {
        case 401: // Unauthorized
          console.log('You must be logged in to view this page.');
          break;
        case 404: // Not Found
          console.log('User information could not be found.');
          break;
        default:
          console.log('An unexpected error occurred. Please try again later.');
      }
		}
	});	
}

function getFavBuildings() {
  $.ajax({
		url: `https://miniproject-2024.ue.r.appspot.com/user/${localStorage.getItem("userId")}/buildings`,
    // url: `https://miniproject-2024.ue.r.appspot.com/user/3/buildings`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    crossDomain: true,
		success: function(response) {
			populateBuildingsTable(response);
		},
		error: function(xhr) {
			// Handle different error scenarios
      switch (xhr.status) {
        case 404: // Not Found
          console.log(`User with id ${localStorage.getItem('userId')} not found.`);
          break;
        default:
          console.log('An unexpected error occurred. Please try again later.');
      }
		}
	});	
}

function populateBuildingsTable(buildings) {
  const tableBody = $('#saved-buildings');
  tableBody.empty();

  buildings.forEach((building, index) => {
    const featuresList = building.features ? building.features.join(", ") : "None";
    const row = `
      <tr id="building-row-${building.id}">
        <td>${building.address}</td>
        <td>${building.city}</td>
        <td>${building.state}</td>
        <td>${featuresList}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteBuilding(${building.id})">Remove</button>
        </td>
      </tr>
    `;
    tableBody.append(row);
  });

  showBuildingsTable();
}

function getFavHousingUnits() {
  $.ajax({
		url: `https://miniproject-2024.ue.r.appspot.com/user/${localStorage.getItem("userId")}/housing-units`,
    // url: `https://miniproject-2024.ue.r.appspot.com/user/2/housing-units`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    crossDomain: true,
		success: function(response) {
      console.log(`get housing unit info successful`);
			populateHousingUnitsTable(response);
		},
		error: function(xhr) {
			// Handle different error scenarios
      switch (xhr.status) {
        case 404: // Not Found
          console.log(`User with id ${localStorage.getItem("userId")} not found.`);
          break;
        default:
          console.log('An unexpected error occurred. Please try again later.');
      }
		}
	});	
}

function populateHousingUnitsTable(units) {
  const tableBody = $('#saved-housing-units');
  tableBody.empty();

  units.forEach((unit, index) => {
    const unitFeatures = unit.housing_unit_features ? unit.housing_unit_features.join(", ") : "None";
    const buildingFeatures = unit.building.features ? unit.building.features.join(", ") : "None";
    const building = unit.building.address + ", " + unit.building.city + ", " + unit.building.state;
    const row = `
      <tr id="housing-unit-row-${unit.id}">
        <td>${unit.unit_number}</td>
        <td>${building}</td>
        <td>${unitFeatures}</td>
        <td>${buildingFeatures}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteHousingUnit(${unit.id})">Remove</button>
        </td>
      </tr>
    `;
    tableBody.append(row);
  });

  showHousingUnitsTable();
}

function showBuildingsTable() {
  $('#buildings').addClass('show active');
  $('#housing-units').removeClass('show active');
}

function showHousingUnitsTable() {
  $('#housing-units').addClass('show active');
  $('#buildings').removeClass('show active');
}

function deleteBuilding(buildingId) {
  const userId = localStorage.getItem("userId");

  $.ajax({
    url: `https://miniproject-2024.ue.r.appspot.com/user/${userId}/building/${buildingId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    crossDomain: true,
    success: function(response) {
      console.log(`Building with ID ${buildingId} successfully removed.`);
      // Remove the row from the table
      $(`#building-row-${buildingId}`).remove();
    },
    error: function(xhr) {
      console.error(`Error removing building with ID ${buildingId}:`, xhr.responseText);
    }
  });
}

function deleteHousingUnit(housingUnitId) {
  const userId = localStorage.getItem("userId");

  $.ajax({
    url: `https://miniproject-2024.ue.r.appspot.com/user/${userId}/housing-unit/${housingUnitId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    crossDomain: true,
    success: function(response) {
      console.log(`Housing Unit with ID ${housingUnitId} successfully removed.`);
      // Remove the row from the table
      $(`#housing-unit-row-${housingUnitId}`).remove();
    },
    error: function(xhr) {
      console.error(`Error removing housing unit with ID ${housingUnitId}:`, xhr.responseText);
    }
  });
}
