function handleSearch(form) {
    var query = form.search.value.trim();
    if (query === '') {
        form.search.value = '';
        form.search.focus(); 
        return false; 
    }

    window.location.href = `search.html?search=${encodeURIComponent(query)}`;
    return false;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function displaySearchResults() {
    const query = getQueryParam('search');
    const resultsContainer = document.getElementById('search-results');

    resultsContainer.innerHTML = '';

    if (!query) {
        resultsContainer.innerHTML = '<li>No search query provided.</li>';
        return;
    }

    console.log('Fetching results for query:', query);

    const buildingFeaturesUrl = 'https://miniproject-2024.ue.r.appspot.com/building-features';
    const housingUnitFeaturesUrl = 'https://miniproject-2024.ue.r.appspot.com/housing-unit-features';
    const buildingsUrl = 'https://miniproject-2024.ue.r.appspot.com/buildings';

    Promise.all([
        fetch(buildingFeaturesUrl).then(response => {
            if (!response.ok) throw new Error(`Failed to fetch building features: ${response.statusText}`);
            return response.json();
        }),
        fetch(housingUnitFeaturesUrl).then(response => {
            if (!response.ok) throw new Error(`Failed to fetch housing units features: ${response.statusText}`);
            return response.json();
        }),
        fetch(buildingsUrl).then(response => {
            if (!response.ok) throw new Error(`Failed to fetch buildings: ${response.statusText}`);
            return response.json();
        })
    ])
        .then(([buildingFeatures, housingUnitFeatures, buildings]) => {
            const filteredBuildingFeatures = buildingFeatures.filter(feature =>
                feature.name.toLowerCase().includes(query.toLowerCase())
            );

            const filteredHousingUnits = housingUnitFeatures.filter(feature =>
                feature.name.toLowerCase().includes(query.toLowerCase())
            );

            const filteredBuildings = buildings.filter(building =>
                building.address.toLowerCase().includes(query.toLowerCase())
            )

            const results = [];

            if (filteredBuildingFeatures.length > 0) {
                results.push('<br><h4>Building Features:</h4><ul>' +
                    filteredBuildingFeatures.map(feature => `<li><a href="buildingfeature.html?id=${feature.id}">${feature.name}</a></li>`).join('') +
                    '</ul>');
            }

            if (filteredHousingUnits.length > 0) {
                results.push('<br><h4>Housing Unit Features:</h4><ul>' +
                    filteredHousingUnits.map(feature => `<li><a href="housingunitfeature.html?id=${feature.id}">${feature.name}</a></li>`).join('') +
                    '</ul>');
            }

            if (filteredBuildings.length > 0) {
                results.push('<br><h4>Buildings:</h4><ul>' +
                    filteredBuildings.map(building => `<li><a href="building.html?id=${building.id}">${building.address}</a></li>`).join('') +
                    '</ul>');
            }

            if (results.length === 0) {
                resultsContainer.innerHTML = `<br><li>No results found for "${query}".</li>`;
                return;
            }

            resultsContainer.innerHTML = results.join('');
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<li>Error fetching search results. Please try again later.</li>';
        });
}

window.onload = displaySearchResults;
