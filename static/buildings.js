$(document).ready(function () {
    retrieveBuildings();
});

function retrieveBuildings() {
    $.ajax({
        url: 'https://miniproject-2024.ue.r.appspot.com/buildings', // Replace with your API URL
        method: 'GET',
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
        buildingsList.html('<p>No buildings found.</p>');
        return;
    }

    buildings.forEach(building => {
        const buildingCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${building.address}</h5>
                        <p class="card-text">
                            <strong>City:</strong> ${building.city}<br>
                            <strong>State:</strong> ${building.state}<br>
                            <strong>Zip Code:</strong> ${building.zipCode}<br>
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
