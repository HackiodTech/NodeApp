const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Get location information
        const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const locationData = locationResponse.data;
        const city = locationData.city || 'Unknown location';
        const { lat, lon } = locationData;

        // Get the weather information from Tomorrow.io
        const apiKey = 'LtXbnczGhGd5VKq1huA8PLmP7lfh6WXX'; 
        const weatherResponse = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`);
        const weatherData = weatherResponse.data;
        const temperature = weatherData.data.timelines[0].intervals[0].values.temperature; // Adjust according to the exact structure of the response

        const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: greeting
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get location or weather data', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
