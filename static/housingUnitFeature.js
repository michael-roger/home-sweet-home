$(document).ready(function () {
    retrieveUnits();
});

function retrieveUnits() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        $('#error-message').html('<p>No ID provided in the URL.</p>');
        return;
    }

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/housing-unit-feature/${id}/housing-units`,
        method: 'GET',
        success: function (response) {
            console.log('Housing units retrieved successfully:', response);
            displayUnits(response);
        },
        error: function (xhr) {
            displayError(xhr);
        }
    });
}

function displayUnits(units) {
    const unitsList = $('#units-list');
    unitsList.empty();

    if (units.length === 0) {
        unitsList.html('<p>No housing units found for the desired housing unit feature.</p>');
        return;
    }

    units.forEach(unit => {
        const unitFeatures = unit.housing_unit_features ? unit.housing_unit_features.join(", ") : "None";
        const buildingFeatures = unit.building.features ? unit.building.features.join(", ") : "None";
        const building = unit.building.address + ", " + unit.building.city + ", " + unit.building.state;
        const unitCard = `
        <div class="col-md-4">
            <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">${unit.unit_number}</h5>
                <p class="card-text">
                <strong>Building:</strong> ${building}<br>
                <strong>Housing Unit Features:</strong> ${unitFeatures}<br>
                <strong>Building Features:</strong> ${buildingFeatures}<br>
                </p>
                <a href="building.html?id=${unit.building.id}" class="btn btn-primary">View Details</a>
            </div>
            </div>
        </div>
        `;
        unitsList.append(unitCard);
    });
}

function displayError(xhr) {
    const errorMessage = `An error occurred: ${xhr.statusText || 'Unknown Error'} (Status Code: ${xhr.status || 'Unknown'})`;
    const errorDetails = xhr.responseText || 'Please check if the server is running and accessible.';
    $('#error-message').html(`<p>${errorMessage}<br>Details: ${errorDetails}</p>`);
}
