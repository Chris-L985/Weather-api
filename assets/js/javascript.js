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
      console.log(data);
      oneCallData = data;
    })
    .catch((err) => {
      console.log(`There was an error fetching data [${err.message}]`);
      throw new Error(err.message);
    });

    renderGeneralCityInfo(forecastData, oneCallData);
    render5DayForecast(oneCallData);
};

// variable to display array data on the pages
const renderGeneralCityInfo = (forecastData, oneCallData) => {
  const { city } = forecastData;
  const { temp, wind_speed, humidity, uvi } = oneCallData.current;

  // code to retrieve the current date
  const date = new Date();
  const dateDay = date.getDate();
  const dateMonth = date.getMonth() + 1;
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

const render5DayForecast = (oneCallData) => {
    const { daily } = oneCallData;

    const renderedForecastData = daily.map(( item, i) => {
        const { temp , wind_speed , humidity , dt } = item;

        const date = new Date(dt * 1000);
        const dateDay = date.getDate();
        const dateMonth = date.getMonth() + 1;
        const dateYear = date.getFullYear();
        const formattedDate = `${dateMonth}/${dateDay}/${dateYear}`;
        const kelvinToFarenheit = (((temp.day - 273.15) * (9 / 5)) + 32);

        const renderedTemperature = `Temp: ${Math.round(kelvinToFarenheit)}°F`;
        const renderedWindsSpeed = `Wind: ${wind_speed} MPH`;
        const renderedHumidity = `Humidity: ${humidity} % `;

        if (i > 5 || i === 0) {
            return "";
        }
    
        return (`
            <div class="forecast-data-card">
                <h3>${formattedDate}</h3>
                <h3>${renderedWindsSpeed}</h3>
                <h3>${renderedTemperature}</h3>
                <h3>${renderedHumidity}</h3>
            </div>
        `)
    });

    $('#forecast-data').empty().html(renderedForecastData)
};

const localStorageUtility = (action, value) => {
  if (action === 'set') {
    const searches = JSON.parse(localStorage.getItem('searches') ?? "[]");
    searches.push(value);
    localStorage.setItem('searches', JSON.stringify(searches));
  } else if (action === 'get') {
    return JSON.parse(localStorage.getItem('searches') ?? "[]");
  }
};

const renderSavedSearches = async () => {
  const searches = localStorageUtility('get');
  const renderedSearches = searches.map((search, i) => {
    const trimmedSearch = search.replace(/ /g, "-");
    return (`
      <button id="${trimmedSearch + i}">${search}</button>
    `);
  });
  $("#recent-city").empty().html(renderedSearches);

  searches.map((search, i) => {
    const trimmedSearch = search.replace(/ /g, "-");
    $(`#${trimmedSearch}${i}`).click(() => {
      searchForLocation(search);
      $("#search-input").val(search);
    });
  });
};

const searchButton = $('#forecast-search-button');

searchButton.on('click', () => {
  const searchInputValue = $('#search-input').val() || '';
  if (searchInputValue !== "") {
    searchForLocation(searchInputValue);
    localStorageUtility('set', searchInputValue);
    renderSavedSearches();
  }
});
