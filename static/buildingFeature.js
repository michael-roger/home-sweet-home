$(document).ready(function () {
    retrieveBuildings();
});

function retrieveBuildings() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        $('#error-message').html('<p>No ID provided in the URL.</p>');
        return;
    }

    const token = localStorage.getItem("token");

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/building-feature/${id}/buildings`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function (response) {
            console.log('Buildings retrieved successfully:', response);
            displayBuildings(response);
        },
        error: function (xhr) {
            displayError(xhr);
        }
    });
}

function displayBuildings(buildings) {
    const buildingsList = $('#buildings-list');
    buildingsList.empty();

    if (buildings.length === 0) {
        buildingsList.html('<p>No buildings found for the desired building feature.</p>');
        return;
    }

    buildings.forEach(building => {
        const buildingCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${building.building_address}</h5>
                        <p class="card-text">
                            <strong>City:</strong> ${building.city}<br>
                            <strong>State:</strong> ${building.state}<br>
                            <strong>Zip Code:</strong> ${building.zipcode}<br>
                        </p>
                        <a href="building.html?id=${building.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
        buildingsList.append(buildingCard);
    });
}

function displayError(xhr) {
    const errorMessage = `An error occurred: ${xhr.statusText || 'Unknown Error'} (Status Code: ${xhr.status || 'Unknown'})`;
    const errorDetails = xhr.responseText || 'Please check if the server is running and accessible.';
    $('#error-message').html(`<p>${errorMessage}<br>Details: ${errorDetails}</p>`);
}
