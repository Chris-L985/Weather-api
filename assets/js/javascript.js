// api key for weather
const weatherApiKey = "e9170727208e717e9feb77d4d1715905";

// variable to fetch data from the api
const searchForLocation = async (cityName) => {
  let forecastData;
  let oneCallData;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}`;

  await fetch(forecastApiUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      forecastData = data;
    })
    .catch((err) => {
      console.log(`There was an error fething data [${err.message}]`);
      throw new Error(err.message);
    });

  // variable for latitude and longitude coordinates
  const { lat, lon } = forecastData.city.coord;
  const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherApiKey}`;

  await fetch(oneCallApiUrl)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data.current);
      oneCallData = data.current;
    })
    .catch((err) => {
      console.log(`There was an error fetching data [${err.message}]`);
      throw new Error(err.message);
    });

    renderGeneralCityInfo(forecastData, oneCallData);
};

// variable to display array data on the page
const renderGeneralCityInfo = (forecastData, oneCallData) => {
  const { city } = forecastData;
  const { temp, wind_speed, humidity, uvi } = oneCallData;

  // code to retrieve the current date
  const date = new Date();
  const dateDay = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();
  const formattedDate = `${dateMonth}/${dateDay}/${dateYear}`;
  const kelvinToFarenheit = (((temp - 273.15) * (9 / 5)) + 32);

  // code to change classes based on uvIndex
  const getUviClass = (uvIndex) => {
    if (uvIndex < 2) return "low";
    if (uvIndex < 5) return "moderate";
    if (uvIndex < 7) return "high";
    if (uvIndex < 10) return "very-high";
    if (uvIndex > 10) return "extreme";

  };

  const renderedCityName = `${city.name} (${formattedDate})`;
  const renderedTemperature = `Temp: ${Math.round(kelvinToFarenheit)}°F`;
  const renderedWindsSpeed = `Wind: ${wind_speed} MPH`;
  const renderedHumidity = `Humidity: ${humidity} % `;
  const renderedUvIndex = `UV Index: <span class=" uvi-pill ${getUviClass(uvi)}">${uvi}</span>`

  // variable to render api data to the DOM
  const generalCityWeatherInfo = (`
    <h2>${renderedCityName}</h2>
    <h5>${renderedTemperature}</h5>
    <h5>${renderedWindsSpeed}</h5>
    <h5>${renderedHumidity}</h5>
    <h5>${renderedUvIndex}</h5>
  `);

  $('#general-city-weather-info').empty().html(generalCityWeatherInfo);
};

const searchButton = $('#forecast-search-button');
searchButton.on('click', () => {
  const searchInputValue = $('#search-input').val() || '';
  searchForLocation(searchInputValue);
});
