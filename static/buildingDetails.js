$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('id'); 

    if (!buildingId) {
        $('#error-message').text('Building ID is missing in the URL.');
        return;
    }

    fetchBuildingDetails(buildingId);
    fetchHousingUnits(buildingId);
});

function fetchBuildingDetails(buildingId) {
    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/building/${buildingId}`,
        method: 'GET',
        success: function (response) {
            displayBuildingDetails(response);
        },
        error: function (xhr) {
            displayError(xhr);
        }
    });
}

function fetchHousingUnits(buildingId) {
    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/buildings/${buildingId}/housing-units`,
        method: 'GET',
        success: function (response) {
            displayHousingUnits(response);
        },
        error: function (xhr) {
            if (xhr.status === 204) {
                $('#housing-units').html('<p>No housing units found for this building.</p>');
            } else {
                displayError(xhr);
            }
        }
    });
}

function displayBuildingDetails(building) {
    $('#building-address').text(building.address);
    const featuresList = $('#building-features');

    building.features.forEach(feature => {
        featuresList.append(`<li class="list-group-item">${feature}</li>`);
    });
}

function displayHousingUnits(housingUnits) {
    const housingUnitsList = $('#housing-units');

    housingUnits.forEach(unit => {
        housingUnitsList.append(`<li class="list-group-item">Unit Number: ${unit.unitNumber}</li>`);
    });
}

function displayError(xhr) {
    const errorMessage = `An error occurred: ${xhr.statusText || 'Unknown Error'} (Status Code: ${xhr.status || 'Unknown'})`;
    const errorDetails = xhr.responseText || 'Please check if the server is running and accessible.';
    $('#error-message').html(`<p>${errorMessage}<br>Details: ${errorDetails}</p>`);
}
