$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const buildingId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!buildingId) {
        $('#error-message').text('Building ID is missing in the URL.');
        return;
    }

    fetchBuildingDetails(buildingId);
    fetchHousingUnits(buildingId);

    if (token) {
        console.log("Token: " + token);
        getUserId(token, buildingId);
        
    } else {
        setupFavoriteBuildingButton(false);
    }
});

function getUserId(token, buildingId) {
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
                const userId = localStorage.getItem('userId');
                console.log("User ID: " + userId);
                checkBuildingFavorites(userId, buildingId);
                checkHousingUnitFavorites(userId);

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

function fetchBuildingDetails(buildingId) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/building/${buildingId}`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function (response) {
            displayBuildingDetails(response);
        },
        error: function (xhr) {
            displayError(xhr);
        }
    });
}

function fetchHousingUnits(buildingId) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/buildings/${buildingId}/housing-units`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
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

    const buildingDetails = `
        <p><strong>Address:</strong> ${building.address}</p>
        <p><strong>City:</strong> ${building.city}</p>
        <p><strong>State:</strong> ${building.state}</p>
        <p><strong>Zip Code:</strong> ${building.zip_code}</p>
    `;
    $('#building-details').html(buildingDetails);

    const featuresList = $('#building-features');
    featuresList.empty();

    if (building.features && Array.isArray(building.features)) {
        building.features.length > 0
            ? building.features.forEach(feature => featuresList.append(`<li class="list-group-item">${feature}</li>`))
            : featuresList.append('<li class="list-group-item text-muted">No features available.</li>');
    } else {
        featuresList.append('<li class="list-group-item text-muted">No features available.</li>');
    }
}

function displayHousingUnits(housingUnits) {
    const housingUnitsList = $('#housing-units');
    housingUnitsList.empty();

    housingUnits.forEach(unit => {
        fetchHousingUnitDetails(unit.id, function (unitDetails) {
            const features = unitDetails.housing_unit_features && unitDetails.housing_unit_features.length > 0
                ? unitDetails.housing_unit_features.map(feature => `<li>${feature}</li>`).join('')
                : 'No features available';
    
            const token = localStorage.getItem('token');
    
            const housingUnitHtml = `
                <li class="list-group-item">
                    <strong>Unit Number:</strong> ${unitDetails.unit_number}<br>
                    <strong>Features:</strong>
                    <ul>${features}</ul>
                    ${
                        token
                            ? `<button id="favorite-unit-${unitDetails.id}" class="btn btn-primary favorite-button-unit" data-unit-id="${unitDetails.id}" disabled>Loading...</button>`
                            : '' // No button if no token
                    }
                </li>
            `;
            housingUnitsList.append(housingUnitHtml);
    
            if (token) {
                // Further setup for logged-in users
                setupFavoriteUnitButtons(true); // Adjust your logic as necessary
            }
    })
    });

    const token = localStorage.getItem('token');
    if (token) {
        const userId = localStorage.getItem('userId');
        checkHousingUnitFavorites(userId);
    }
}

function fetchHousingUnitDetails(unitId, callback) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/housing-unit/${unitId}`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function (response) {
            callback(response);
        },
        error: function () {
            console.error(`Failed to fetch details for housing unit ID: ${unitId}`);
        }
    });
}

function checkBuildingFavorites(userId, buildingId) {
    const token = localStorage.getItem("token");
    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/user/${userId}/buildings`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function (response) {
            const favoritedBuildings = response.map(building => building.id);
            const isFavorited = favoritedBuildings.includes(parseInt(buildingId));
            setupFavoriteBuildingButton(true, buildingId, isFavorited);
        },
        error: function () {
            console.error('Error fetching user favorite buildings.');
        }
    });
}

function checkHousingUnitFavorites(userId) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `https://miniproject-2024.ue.r.appspot.com/user/${userId}/housing-units`,
        method: 'GET',
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function (response) {
            const favoritedUnits = response.map(unit => unit.id);
            setupFavoriteUnitButtons(true, favoritedUnits);
        },
        error: function () {
            console.error('Error fetching user favorite housing units.');
        }
    });
}

function setupFavoriteBuildingButton(isLoggedIn, buildingId = null, isFavorited = false) {
    const button = $('#favorite-button-building');
    button.prop('disabled', false);

    if (!isLoggedIn) {
        // button.text('Add to Favorites');
        // button.off('click').on('click', () => {
        //     alert('You must be logged in to favorite items.');
        // });
        button.addClass('d-none');
        return;
    }

    if (isFavorited) {
        button.text('Remove from Favorites');
        button.off('click').on('click', () => toggleFavoriteBuilding(buildingId, false));
    } else {
        button.text('Add to Favorites');
        button.off('click').on('click', () => toggleFavoriteBuilding(buildingId, true));
    }
}

function setupFavoriteUnitButtons(isLoggedIn, favoritedUnits = []) {
    $('.favorite-button-unit').each(function () {
        const button = $(this);
        const unitId = parseInt(button.data('unit-id'));

        button.prop('disabled', false);

        if (!isLoggedIn) {
            button.addClass('d-none');
            // button.text('Add to Favorites');
            // button.off('click').on('click', () => {
            //     alert('You must be logged in to favorite items.');
            // });
            return;
        }

        if (favoritedUnits.includes(unitId)) {
            button.text('Remove from Favorites');
            button.off('click').on('click', () => toggleFavoriteHousingUnit(unitId, false));
        } else {
            button.text('Add to Favorites');
            button.off('click').on('click', () => toggleFavoriteHousingUnit(unitId, true));
        }
    });
}

function toggleFavoriteBuilding(buildingId, add) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You must be logged in to favorite items.');
        return;
    }

    var url = `https://miniproject-2024.ue.r.appspot.com/user/${userId}/buildings/${buildingId}`;
    if(add){
        url = `https://miniproject-2024.ue.r.appspot.com/user/${userId}/buildings/${buildingId}`;
    }
    else{
        url = `https://miniproject-2024.ue.r.appspot.com/user/${userId}/building/${buildingId}`;
    }
    const method = add ? 'POST' : 'DELETE';

    const token = localStorage.getItem("token");

    $.ajax({
        url: url,
        method: method,
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        crossDomain: true,
        success: function () {
            // alert(`Building successfully ${add ? 'added to' : 'removed from'} favorites.`);
            setupFavoriteBuildingButton(true, buildingId, !add);
            const button = $('#favorite-button-building');
            button.prop('disabled', false);
            button.text(`${!add ? 'Add to' : 'Remove from'} Favorites`);
            button.off('click').on('click', () => toggleFavoriteBuilding(buildingId, !add));
        },
        error: function (xhr) {
            console.error(`Error ${add ? 'adding' : 'removing'} building from favorites.`, xhr.responseText);
            console.log(`Request failed with status: ${xhr.status}`);
            console.log(`Response text: ${xhr.responseText}`);
            alert(`Failed to ${add ? 'add' : 'remove'} building from favorites. Please try again.`);
        },
    });
}


function toggleFavoriteHousingUnit(unitId, add) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You must be logged in to favorite items.');
        return;
    }

    const url = `https://miniproject-2024.ue.r.appspot.com/user/${userId}/housing-unit/${unitId}`;
    const method = add ? 'POST' : 'DELETE';

    const token = localStorage.getItem("token");

    $.ajax({
        url: url,
        method: method,
        headers: token ? { 'token': token } : {}, // add token in header if it exists
        success: function () {
            // alert(`Housing unit successfully ${add ? 'added to' : 'removed from'} favorites.`);
            checkHousingUnitFavorites(userId);
            // location.reload();
            console.log("page reloaded");
        },
        error: function () {
            console.error(`Error ${add ? 'adding' : 'removing'} housing unit from favorites.`);
        }
    });
}

function displayError(xhr) {
    const errorMessage = `An error occurred: ${xhr.statusText || 'Unknown Error'} (Status Code: ${xhr.status || 'Unknown'})`;
    const errorDetails = xhr.responseText || 'Please check if the server is running and accessible.';
    $('#error-message').html(`<p>${errorMessage}<br>Details: ${errorDetails}</p>`);
}
