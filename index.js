require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.get('/api/buses', async (req, res) => {
    try {
        const response = await axios.get('https://nextrip-public-api.azure-api.net/octranspo/gtfs-rt-vp/beta/v1/VehiclePositions?format=json', {
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.OCTRANSPO_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Well well well something happened... ", error.message);
    }
});

app.listen(3000)