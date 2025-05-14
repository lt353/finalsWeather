const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html of root path
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

// Handle form submission
app.post("/", function (req, res) {
	const searchType = req.body.searchType;
	let url;
	
	const units = "imperial";
	const apiKey = process.env.API_KEY;
	
	if (searchType === "cityId") {
		const cityId = String(req.body.cityId);
		console.log("City ID:", cityId);
		
		url = "https://api.openweathermap.org/data/2.5/weather?id=" +
			cityId +
			"&units=" +
			units +
			"&APPID=" +
			apiKey;
	} else {
		const lat = String(req.body.lat);
		const lon = String(req.body.lon);
		console.log("Coordinates:", lat, lon);
		
		url = "https://api.openweathermap.org/data/2.5/weather?lat=" +
			lat +
			"&lon=" +
			lon +
			"&units=" +
			units +
			"&APPID=" +
			apiKey;
	}

	// Get data from OpenWeatherAPI
	https.get(url, function (response) {
		console.log(response.statusCode);
		
		let data = "";
		response.on("data", function (chunk) {
			data += chunk;
		});
		
		response.on("end", function () {
			const weatherData = JSON.parse(data);
			
			// Extract the required data
			const temp = weatherData.main.temp;
			const cityName = weatherData.name;
			const humidity = weatherData.main.humidity;
			const cloudiness = weatherData.clouds.all;
			const windSpeed = weatherData.wind.speed;
			const weatherDescription = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
			
			// Create and send the response
			res.write(`<h1>Weather in ${cityName}</h1>`);
			res.write(`<h2>${weatherDescription}</h2>`);
			res.write(`<img src="${imageURL}">`);
			res.write(`<p>Temperature: ${temp} &deg;F</p>`);
			res.write(`<p>Humidity: ${humidity}%</p>`);
			res.write(`<p>Wind Speed: ${windSpeed} mph</p>`);
			res.write(`<p>Cloudiness: ${cloudiness}%</p>`);
			res.send();
		});
	});
});

// Start the server
app.listen(process.env.PORT || 3000, function () {
	console.log("Server is running on port 3000");
});
