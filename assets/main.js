var searchBoxEl = document.querySelector("#searchBar");
var now = moment().format("(MM/DD/YYYY)");
var forecastContainerEl = document.querySelector("#forecast");
var currentWeatherEl = document.querySelector("#todayWeather");
var memoryGroupEl = document.querySelector("#memory");
var memoryArr = [];
var getUV = function(lat, long) {
    fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${long}&appid=45a78f0ac2c618cf3dcdf8fdad32c0ca`
    )
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var index = data["value"];
        if (index >= 8) {
            var indexBox = document.createElement("p");
            indexBox.innerHTML = "UV index: <span class='bg-danger txt-white'>" + index + "</span>";
            currentWeatherEl.appendChild(indexBox);
        }
        else if (index >= 3) {
            var indexBox = document.createElement("p");
            indexBox.innerHTML = "UV index: <span class='bg-warning txt-white'>" + index + "</span>";
            currentWeatherEl.appendChild(indexBox);
        }
        else {
            var indexBox = document.createElement("p");
            indexBox.innerHTML = "UV index: <span class='bg-success txt-white'>" + index + "</span>";
            currentWeatherEl.appendChild(indexBox);
        }
    })
};
var getForecast = function (city) {
    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=45a78f0ac2c618cf3dcdf8fdad32c0ca`
    )
        .then(response => response.json())
        .then(data => {
            console.log(data)
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1 ) {
                    //sets value of card elements
                    var date = new Date(data.list[i].dt_txt).toLocaleDateString();
                    var temp = data["list"][i]["main"]["temp"];
                    var humidity = data["list"][i]["main"]["humidity"];
                    var icon = data["list"][i]["weather"]["0"]["icon"];
                    //creates card to hold forecast data
                    var newCard = document.createElement("div");
                    newCard.setAttribute("class", "card bg-primary text-white");
                    forecastContainerEl.appendChild(newCard);
                    //creates elements and sets inner html to hold forecast data
                    var dateEl = document.createElement("h3");
                    dateEl.innerHTML = date;
                    var iconEl = document.createElement("img");
                    iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + icon + ".png");
                    iconEl.setAttribute("width", "50px");
                    var tempEl =document.createElement("p");
                    tempEl.innerHTML = "Temp: " + temp + "\u00B0";
                    var humidityEl = document.createElement("p");
                    humidityEl.innerHTML = "Humidity: " + humidity + "%";
                    // appends elements cards
                    newCard.appendChild(dateEl);
                    newCard.appendChild(iconEl);
                    newCard.appendChild(tempEl);
                    newCard.appendChild(humidityEl); 
                }
            }
            var lat = data["city"]["coord"]["lat"];
            var long = data["city"]["coord"]["lon"];
            getUV(lat,long);            
        }) 
};
var getWeather = function () {
    forecastContainerEl.innerHTML = "";
    currentWeatherEl.innerHTML = "";
    
    var city = searchBoxEl.value.trim();
    // local storage
    memoryArr.push(city);
    var JSONlist = JSON.stringify(memoryArr);
    localStorage.setItem("memoryArr", JSONlist);
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=45a78f0ac2c618cf3dcdf8fdad32c0ca`
    )
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
            //variables that hold the values of the current weather data
            var nameVal = data["name"]
            var tempVal = data["main"]["temp"]
            var humidityVal = data["main"]["humidity"]
            var windVal = data["wind"]["speed"]
            var iconVal = data["weather"]["0"]["icon"]
            var weatherCard = document.createElement("div");
            //adds to search history
            var newList = document.createElement("li");
            newList.setAttribute("class", "list-group-item");
            newList.innerHTML = nameVal;
            memoryGroupEl.appendChild(newList);
            //creates card to hold current weather data
            weatherCard.setAttribute("class", "card mx-auto");
            currentWeatherEl.appendChild(weatherCard);
            //creates elements and sets inner HTML text and values for weather data
            var cityName =document.createElement("h2");
            cityName.innerHTML = nameVal + " " + now;
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute("src", "http://openweathermap.org/img/w/" + iconVal + ".png");
            weatherIcon.setAttribute("width", "75px");
            var temperature = document.createElement("p");
            temperature.innerHTML = "Temperature: " + tempVal + "\u00B0";
            var humid = document.createElement("p");
            humid.innerHTML = "Humidity: " + humidityVal + "%";
            var windSpeed = document.createElement("p");
            windSpeed.innerHTML = "Wind Speed: " + windVal + " mph";
            //appends the created elements
            weatherCard.appendChild(cityName);
            weatherCard.appendChild(weatherIcon);
            weatherCard.appendChild(temperature);
            weatherCard.appendChild(humid);
            weatherCard.appendChild(windSpeed);
        })
        .catch(err => alert("City not found"));
    getForecast(city);
};

