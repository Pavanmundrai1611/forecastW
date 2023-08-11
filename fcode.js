document.addEventListener('DOMContentLoaded', () => {
    let isCelsius = true;
    var temperatureUnit = isCelsius ? '&#8451;' : '&#8457;';
    const apiKey = '0752aac82d8dfcb00d18a0be6916b4e4';

    const weatherSection = document.querySelector('#forecast-section');
    const manualLocationInput = document.querySelector('.manuallocation');
    const automaticLocationButton = document.getElementById('automaticlocation');
    const submitButton = document.getElementById('submit-button');

    let selectedLocation = null;

    manualLocationInput.addEventListener('input', function () {
        selectedLocation = manualLocationInput.value;
        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
    });

    function handleLocationError(error) {
        console.error('Error getting location:', error);
        selectedLocation = "Location could not be determined. Enter again";
        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
    }

    automaticLocationButton.addEventListener('click', function () {
        // Get the user's location using Geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const apiUrl1 = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
                console.log(apiUrl1);
                fetch(apiUrl1)
                    .then(response => response.json())
                    .then(data => {
                        if (data.address && data.address.city) {
                            selectedLocation = data.address.city;
                        } else {
                            selectedLocation = 'Town not found';
                        }
                        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
                    })
                    .catch(handleLocationError);
            }, handleLocationError);
        } else {
            selectedLocation = "Geolocation is not supported by this browser.";
            document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
        }
    });


    submitButton.addEventListener('click', function () {
        if (selectedLocation !== null) {
            document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
            getForecast(selectedLocation);
        } else {
            alert("Please enter a location");
        }
    });


    async function getForecast(location) {
        try {
            weatherSection.innerHTML = '';
            const loading = createLoadingElement();
            weatherSection.appendChild(loading);
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`);
            const data = await forecastResponse.json();
            displayForecast(data);
            loading.remove();
        } catch (error) {
            console.error('Error fetching Forecast data:', error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            errorDiv.textContent = 'Unable to fetch Forecast data. Please check the location and try again.';
            weatherSection.appendChild(errorDiv);
            loading.remove();
        }
    }
    function createLoadingElement() {
        const loading = document.createElement('div');
        loading.classList.add('loading');
        return loading;
    }

    function displayForecast(forecastData) {
        weatherSection.innerHTML = '';
        const forecasts = forecastData.list;
        for (const forecast of forecasts) {
            const date = new Date(forecast.dt * 1000);
            const temperature = forecast.main.temp;
            const conditions = forecast.weather[0].description;
            const icon = forecast.weather[0].icon;
            // Declare and define temperatureUnit
            const temperatureValue = isCelsius ? temperature : (temperature * 1.8 + 32).toFixed(1);

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p>${date.toLocaleDateString()}</p>
                <p>Temperature: ${temperatureValue} ${temperatureUnit}</p>
                <p>Conditions: ${conditions}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            `;
            weatherSection.appendChild(forecastItem);
        }
    }



    const checkbox = document.getElementById('bopis');
    checkbox.addEventListener('change', function () {
        isCelsius = !isCelsius; // Toggle the temperature unit
        temperatureUnit = isCelsius ? '&#8451;' : '&#8457;';
        
    });
});
