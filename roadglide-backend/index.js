require('dotenv').config()
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);
const refreshInterval = 30000;

async function fetchBusData() {
    try {
        const url = `https://api.octranspo1.com/v2.0/getNextTripsForStopAllRoutes`;
        const response = await axios.get(url, new URLSearchParams({
            appID: process.env.OCTRANSPO_APP_ID,
            apiKey: process.env.OCTRANSPO_API_KEY,
            stopNo: '3027',
            format: 'json'
        }));
        return response.data;
    } catch (error) {
        console.error("When the API doesn't API... ", error.message);
        return null;
    }
}

setInterval(async () => {
    const data = await fetchBusData();
    if (data) {
        io.emit('busUpdate', data);
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
        console.error("Well well well something happened... ", error.message);
    }
});

server.listen(PORT, () => {
    console.log(`ROAD-GLIDE: LISTENING AT PORT ${PORT}`);
});