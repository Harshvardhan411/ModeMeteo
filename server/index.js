import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Weather API proxy
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;
    
    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=${units}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=${units}`;
    } else {
      return res.status(400).json({ message: 'Please provide city or coordinates' });
    }
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching weather data'
    });
  }
});

// Geo API proxy
app.get('/api/geo', async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${process.env.WEATHER_API_KEY}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Error fetching location data'
    });
  }
});

// Serve the static frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the dist directory
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 