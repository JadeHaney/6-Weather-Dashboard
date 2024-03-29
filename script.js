window.addEventListener('load', function(){
  var searchForm = document.getElementById("searchForm");
  var cityInput = document.getElementById("cityInput");
  var API_KEY = "458ac284ed82506b853e5d277ec61cb1";
  var cities = [];
  
  function getWeather(city){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              displayWeatherDetails(data);
              displayForecast(city); // Display forecast for the current city
          })
          .catch(error => {
              console.log(error);
          });
  }
  
  function displayWeatherDetails(data){
      var weatherContainer = document.getElementById("weatherContainer");
      var weatherBox = document.createElement('div');
      weatherBox.classList.add('current', 'border', 'border-dark-subtle', 'border-2', 'm-3');
      
      var weatherIcon = '';
      switch(data.weather[0].main) {
          case 'Clear':
              weatherIcon = 'sunny.png';
              break;
          case 'Rain':
          case 'Shower Rain':
          case 'Mist':
              weatherIcon = 'rain.png';
              break;
          case 'Thunderstorm':
              weatherIcon = 'thunderstorm.png';
              break;
          case 'Snow':
              weatherIcon = 'snow.png';
              break;
          case 'Clouds':
          case 'Few Clouds':
          case 'Scattered Clouds':
          case 'Broken Clouds':
              weatherIcon = 'cloudy.png';
              break;
          default:
              // Handle other weather conditions
              break;
      }
      
      weatherBox.innerHTML = `
          <h2>${data.name}</h2>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Temperature: ${data.main.temp} K</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Weather: ${data.weather[0].main}</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
          <img src="${weatherIcon}" alt="Weather Icon">
      `;
      weatherContainer.appendChild(weatherBox);
      weatherBox.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Auto-scroll to the newly added weather details
  }

  function displayForecast(city){
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              displayForecastDetails(data);
          })
          .catch(error => {
              console.log(error);
          });
  }

  function displayForecastDetails(data){
      var forecastContainer = document.getElementById("forecastContainer");
      forecastContainer.innerHTML = ''; // Clear previous forecast
      
      for (var i = 0; i < 5; i++) {
          var forecast = data.list[i];
          var forecastBox = document.createElement('div');
          forecastBox.classList.add('forecast-day', 'border', 'border-dark-subtle', 'border-2', 'm-3');
          forecastBox.innerHTML = `
              <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
              <p>Temperature: ${forecast.main.temp} K</p>
              <p>Humidity: ${forecast.main.humidity}%</p>
              <p>Weather: ${forecast.weather[0].main}</p>
              <p>Wind Speed: ${forecast.wind.speed} m/s</p>
              <!-- You can add the icon representation of weather conditions here -->
          `;
          forecastContainer.appendChild(forecastBox);
      }
  }

  function displayLastSearchedCities(){
      var historyContainer = document.getElementById("searchHistory");
      historyContainer.innerHTML = ''; // Clear previous history
      for(var i = Math.max(0, cities.length - 5); i < cities.length; i++){
          var city = cities[i];
          var cityBox = document.createElement('div');
          cityBox.classList.add('current', 'border', 'border-dark-subtle', 'border-2', 'm-3');
          cityBox.innerHTML = `<h2>${city}</h2>`;
          historyContainer.appendChild(cityBox);
      }
  }

  searchForm.addEventListener("submit", async function(event){ 
      event.preventDefault();
      var city = cityInput.value.trim();
      if(city !== ''){
          cities.push(city); // Add city to history
          if(cities.length > 5){
              cities.shift(); // Remove the oldest city if more than 5 cities are stored
          }
          displayLastSearchedCities();
          try{
              await getWeather(city);
          }catch(error){
              console.log(error);
          }
      }
  });
});
