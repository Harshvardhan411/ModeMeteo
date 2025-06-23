# ModeMeteo

ModeMeteo is a weather application that provides real-time weather data and outfit recommendations based on current weather conditions.

## Features
- Real-time weather data from OpenWeatherMap API
- Outfit recommendations based on weather conditions
- Interactive map to select locations
- Day/night theme switching based on local sunrise/sunset times
- Detailed weather information (humidity, wind, visibility, etc.)

## Project Structure
- `/src` - React frontend application
- `/server` - Express backend API server
- `/public` - Static assets

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ModeMeteo
```

2. Create environment file
```bash
cp .env.example .env
```

3. Add your OpenWeatherMap API key to the .env file
```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
WEATHER_API_KEY=your_openweathermap_api_key
```

4. Install dependencies for both frontend and backend
```bash
npm run install:all
```

## Development

Run both frontend and backend in development mode:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Frontend only
npm run dev

# Backend only
npm run server
```

## Building for Production

Build the frontend:
```bash
npm run build
```

For deployment, the project includes a `vercel.json` configuration file for Vercel deployment.

## Deployment

### Vercel Deployment
1. Make sure you have the Vercel CLI installed
```bash
npm install -g vercel
```

2. Deploy to Vercel
```bash
vercel
```

## License
See [LICENSE](LICENSE) file for details.

