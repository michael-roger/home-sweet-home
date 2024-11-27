$(document).ready(function () {

  const token = localStorage.getItem('token');

  console.log("Test");
  getProfile(token);

  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    location.reload();
  });

  $('#housing-units-tab').click(function () {
    console.log("housing unit tab clicked");
    getFavHousingUnits();
  });
  
  $('#buildings-tab').click(function () {
    console.log("Buildings tab clicked");
    getFavBuildings();
  });
});

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
		// url: `https://miniproject-2024.ue.r.appspot.com/user/${localStorage.getItem("userId")}/buildings`,
    url: `https://miniproject-2024.ue.r.appspot.com/user/2/buildings`,
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
      <tr>
        <td>${index + 1}</td>
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
}

function getFavHousingUnits() {
  $.ajax({
		// url: `https://miniproject-2024.ue.r.appspot.com/user/${localStorage.getItem("userId")}/buildings`,
    url: `https://miniproject-2024.ue.r.appspot.com/user/2/housing-units`,
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
    const buildingFeatures = unit.features ? unit.features.join(", ") : "None";
    const building = unit.building.address + ", " + unit.building.city + ", " + unit.building.state;
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${unit.unit_number}</td>
        <td>${unitFeatures}</td>
        <td>${building}</td>
        <td>${buildingFeatures}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteBuilding(${unit.id})">Remove</button>
        </td>
      </tr>
    `;
    tableBody.append(row);
  });
}
