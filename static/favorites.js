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
      console.log(`Successfully retrieved user info ${response.firstName} ${response.lastName} ${response.emailAddress}`);
			$('#user-name').text(response.firstName + " " + response.lastName);
      $('#user-email').text(response.emailAddress);
      getFavBuildings(response.id);
      // getFavHousingUnits(response.id);
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

function getFavBuildings(id) {
  $.ajax({
		url: `https://miniproject-2024.ue.r.appspot.com/user/${id}/buildings`,
    // url: `https://miniproject-2024.ue.r.appspot.com/user/2/buildings`,
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
          console.log(`User with id ${id} not found.`);
          break;
        default:
          console.log('An unexpected error occurred. Please try again later.');
      }
		}
	});	
}

function populateBuildingsTable(buildings) {
  const tableBody = $('#saved-buildings');
  tableBody.empty(); // Clear any existing rows

  buildings.forEach((building, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${building.address}</td>
        <td>${building.city}</td>
        <td>${building.state}</td>
        <td>${building.zip_code}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteBuilding(${building.id})">Remove</button>
        </td>
      </tr>
    `;
    tableBody.append(row);
  });
}

function getFavHousingUnits(id) {
  $.ajax({
		url: `https://miniproject-2024.ue.r.appspot.com/user/${id}/buildings`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    crossDomain: true,
		success: function(response) {
			
		},
		error: function(xhr) {
			// Handle different error scenarios
      switch (xhr.status) {
        case 404: // Not Found
          console.log(`User with id ${id} not found.`);
          break;
        default:
          console.log('An unexpected error occurred. Please try again later.');
      }
		}
	});	
}