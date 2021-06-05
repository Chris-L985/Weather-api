const weatherApiKey = "e9170727208e717e9feb77d4d1715905";

const searchForLocation = async (cityName) => {
    let forecastData;
    let uvIndex;
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}`;

    await fetch(forecastApiUrl).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        forecastData = data;
    }).catch(err => {
        console.log(`There was an error fething data [${err.message}]`);
        throw new Error(err.message);
    });

    const { lat, lon } = forecastData.city.coord;
    const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${weatherApiKey}`;

    await fetch(oneCallApiUrl).then(res => {
        return res.json();
    }).then (data => {
        console.log(data.current.uvi);
        unIndex = data.current.uvi;
    }).catch(err => {
        console.log(`There was an error fetching data [${err.message}]`);
        throw new Error(err.message);
    });
};

const searchButton = document.getElementById("forecast-search-button");
searchButton.addEventListener('click', () =>  {
    const searchInputValue = document.getElementById("search-input").value || "";
    searchForLocation(searchInputValue);
});
