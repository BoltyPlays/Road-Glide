//ERRORS: CANNOT FIND THE GEMINI API KEY, CHECK .ENV

// Fix this later!!! I hate the warning that pops up inside my bash terminal
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config()
const express = require('express');
const http = require('http');
const https = require('https')
const agent = new https.Agent({
    rejectUnauthorized: false
});
const { Server } = require('socket.io');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);
const refreshInterval = 30000;
const { getWeather } = require ('./weather.js');
const { getAreaMultipliers } = require('./geminiBackend.js');

let multipliers = {};

async function reloadWeather() {
    console.log("Getting the weather...");
    const regionalWeather = await getWeather();

    if (regionalWeather) {
        multipliers = await getAreaMultipliers(regionalWeather);
        console.log("New delay multipliers loaded: ", multipliers);
    }
}

reloadWeather();
setInterval(reloadWeather, 10 * 60 * 1000);

// Why fetchBusData? Should be obvious, but when called, it fetches info of every single bus currently active
async function fetchBusData() {
    try {
        const url = `https://api.octranspo1.com/v2.0/getNextTripsForStopAllRoutes`;
        const response = await axios.get(url, {
            params: {
                appID: process.env.OCTRANSPO_APP_ID,
                apiKey: process.env.OCTRANSPO_API_KEY,
                stopNo: '3027',
                format: 'json'
            },
            httpsAgent: agent // <--- ADD THIS
        });
        return response.data;
    } catch (error) {
        console.error("When the API doesn't API... ", error.message);
        return null;
    }
}

setInterval(async () => {
    const data = await fetchBusData();
    if (data) {
        io.emit('busUpdate', {
            busData: data,
            multipliers: multipliers
        });
        console.log(`Pushed at ${new Date().toLocaleTimeString()}`);
    }
}, refreshInterval);

app.use(express.json());
app.get('/api/buses', async (req, res) => {
    const inputRoute = req.query.route;
    try {
        const response = await axios.get('https://nextrip-public-api.azure-api.net/octranspo/gtfs-rt-vp/beta/v1/VehiclePositions?format=json', {
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.OCTRANSPO_API_KEY
            }
        });
        const allBuses = response.data.Entity || response.data.entity || [];
        const route = allBuses.filter(bus => {
            return bus?.Vehicle?.Trip?.RouteId === inputRoute});
        res.json(route);
    } catch (error) {
        // If it's a 401 error, check the .env file and make sure it's in the right place
        console.error("Well well well something happened... ", error.message);
    }
});

server.listen(PORT, () => {
    console.log(`ROAD-GLIDE: LISTENING AT PORT ${PORT}`);
});