apiUrl = ("https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}");

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => console.log(data));