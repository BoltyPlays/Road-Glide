const axios = require('axios');

const areas = {
    // This is gonna hurt :,>
    "Downtown": { lat: 45.2520, lon: -75.42 },
    "Ottawa East and Orléans": { lat: 45.28, lon: -75.31 },
    "South-East Ottawa": { lat: 45.4221, lon: -75.6950 }, 
    "Ottawa West": { lat: 45.35, lon: -75.7833 }, 
    "Kanata": { lat: 45.30, lon: -75.9161 }, 
    "Barrhaven": { lat: 45.2716, lon: -75.7499 }, 
    "Nepean": { lat: 45.3361, lon: -75.7225 }, 
    "South Keys and Findlay Creek": { lat: 45.3195, lon: -75.5997 }
};

async function getWeather() {
    try {
        const lats = Object.values(areas).map(s => s.lat).join(',');
        const lons = Object.values(areas).map(s => s.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        const response = await axios.get(url);
        const dataArray = Array.isArray(response.data) ? response.data : [response.data]; // Used to receive multiple locations at once
        const regionalWeather = {};

        Object.keys(areas).forEach((name, index) => {
            const data = dataArray[index].current;
            regionalWeather[name] = {
                temp: data.temperature_2m,
                condition: translateCode(data.weather_code)
            };
        });
        return regionalWeather;
    } catch (error) {
        console.error("It's cloudy with a chance of meatballs... ", error.message);
        return null;
    }
}

function translateCode(code) {
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 61 && code <= 67) return "Raining :<";
    if (code >= 71 && code <= 77) return "Snowing :>";
    return "Clear :D"

}

module.exports = { getWeather };