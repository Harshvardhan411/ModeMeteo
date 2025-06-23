import React, { useEffect, useState } from "react";
import WeatherBackground from "./components/WeatherBackground.jsx";
import OutfitRecommendation from "./components/OutfitRecommendation.jsx";
import WeatherMap from "./components/WeatherMap.jsx";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "./components/Helper.jsx";

import {
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
  HumidityIcon,
} from "./components/Icons.jsx";

import ModeMeteologo from './assets/ModeMeteologo.jpg';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length >= 3 && !weather) {
        fetchSuggestions(city);
      } else {
        setSuggestion([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [city, weather]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
      if (res.ok) {
        setSuggestion(await res.json());
      } else {
        setSuggestion([]);
      }
    } catch (err) {
      console.error("Suggestion fetch error:", err);
      setSuggestion([]);
    }
  };

  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || "City not found");
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please enter a valid city name.");
    await fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`);
  };

  const handleMapLocationSelect = async (lat, lng, locationName) => {
    await fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`, locationName);
    setShowMap(false);
  };

  const getWeatherCondition = () => {
    if (!weather) return { main: null, isDay: true }; // Default to day theme
    return {
      main: weather.weather[0].main,
      isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset,
    };
  };

  const condition = getWeatherCondition();
  const isDay = condition.isDay;

  const theme = {
    container: isDay ? "from-sky-300 to-blue-500" : "from-slate-800 to-gray-900",
    card: isDay ? "bg-white/60 text-gray-800" : "bg-slate-900/60 text-white",
    input: isDay ? "bg-white/50 placeholder-gray-500 focus:ring-blue-500" : "bg-black/30 placeholder-white/70 focus:ring-indigo-400",
    button: isDay ? "bg-blue-500 hover:bg-blue-600" : "bg-indigo-600 hover:bg-indigo-700",
    textColor: isDay ? "text-gray-800" : "text-white",
    subtextColor: isDay ? "text-gray-600" : "text-slate-400",
    borderColor: isDay ? "border-gray-300/50" : "border-slate-700/50",
    detailCard: isDay ? "bg-white/40" : "bg-black/20",
  };

  const DetailItem = ({ icon, label, value }) => (
    <div className={`flex items-center justify-between py-3 border-b ${theme.borderColor}`}>
      <div className="flex items-center space-x-4">
        <span className={`text-xl ${theme.subtextColor}`}>{icon}</span>
        <span className={theme.subtextColor}>{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans bg-gradient-to-br ${theme.container} transition-colors duration-500`}>
      <WeatherBackground condition={condition} />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4">
        {!weather ? (
          <div className="w-full max-w-2xl text-center animate-fade-in-up">
            <img src={ModeMeteologo} alt="ModeMeteo Logo" className="mx-auto mb-6 w-32 h-32 object-contain rounded-full shadow-lg" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 leading-tight">
              <span className="bg-gradient-to-br from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                ModeMeteo
              </span>
              <br />
              <span className="text-3xl md:text-4xl">Fashion Meets Weather</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-12">
              Get real-time forecasts and outfit recommendations for any city on Earth.
            </p>

            <form onSubmit={handleSearch} className="relative w-full">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-white transition-colors duration-300 ${theme.button} flex items-center gap-1 sm:gap-2 text-sm sm:text-base`}
                >
                  <span className="text-base sm:text-lg">🗺️</span>
                  <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Show Map'}</span>
                  <span className="sm:hidden">{showMap ? 'Hide' : 'Map'}</span>
                </button>
              </div>
              
              <div className="relative">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search for a city..."
                  className={`w-full py-3 sm:py-4 pl-4 sm:pl-6 pr-14 sm:pr-16 rounded-full focus:outline-none focus:ring-4 transition-all duration-300 text-base sm:text-lg shadow-2xl backdrop-blur-sm border ${theme.borderColor} ${theme.input} ${theme.textColor}`}
                />
                <button
                  type="submit"
                  className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full text-white transition-colors duration-300 ${theme.button}`}
                  aria-label="Get Weather"
                >
                  {loading ? <SpinnerIcon /> : <SearchIcon />}
                </button>
                {suggestion.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                    {suggestion.map((s) => (
                      <button
                        key={`${s.lat}-${s.lon}`}
                        type="button"
                        onClick={() => fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`, `${s.name}, ${s.country}${s.state ? ", " + s.state : ""}`)}
                        className="block w-full text-left px-5 py-3 text-white hover:bg-indigo-500/50 transition-colors"
                      >
                        <span>{s.name}, {s.country}{s.state && `, ${s.state}`}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
            
            {/* Map Component - Centered below search */}
            {showMap && (
              <div className="mt-6 w-full max-w-4xl mx-auto">
                <WeatherMap 
                  onLocationSelect={handleMapLocationSelect}
                  theme={theme}
                  isVisible={showMap}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-6xl space-y-6">
            {/* Main Weather Card */}
            <div className={`w-full rounded-3xl shadow-2xl backdrop-blur-lg ${theme.card} overflow-hidden transition-colors duration-500`}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Panel */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl sm:text-4xl font-bold">{weather.name}</h2>
                        <p className={theme.subtextColor}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <button onClick={() => setUnit(u => (u === "C" ? "F" : "C"))} className={`py-1 px-3 rounded-lg text-sm transition-colors ${theme.detailCard}`}>
                        °{unit}
                      </button>
                    </div>
                    <div className="flex items-center -ml-6 mt-4">
                      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description} className="w-32 h-32 sm:w-40 sm:h-40" />
                      <div className="flex flex-col">
                        <span className="text-6xl sm:text-7xl font-bold">{convertTemperature(weather.main.temp, unit)}°</span>
                        <p className={`text-lg sm:text-xl capitalize -mt-2 ml-1 ${theme.subtextColor}`}>{weather.weather[0].description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <button onClick={() => { setWeather(null); setCity(""); }} className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors ${theme.button} text-sm sm:text-base`}>
                      Search for another city
                    </button>
                    <button 
                      onClick={() => setShowMap(!showMap)} 
                      className={`px-3 sm:px-4 py-3 rounded-xl text-white font-bold transition-colors ${theme.button} flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base`}
                    >
                      <span className="text-base sm:text-lg">🗺️</span>
                      <span className="hidden sm:inline">{showMap ? 'Hide Map' : 'Map'}</span>
                      <span className="sm:hidden">{showMap ? 'Hide' : 'Map'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Panel */}
                <div className={`p-6 sm:p-8 ${isDay ? 'bg-white/20' : 'bg-black/20'}`}>
                  <h3 className={`text-lg font-semibold mb-4 border-b pb-2 ${theme.borderColor} ${theme.subtextColor}`}>Weather Details</h3>
                  <div className="space-y-1">
                    <DetailItem label="Feels Like" value={`${convertTemperature(weather.main.feels_like, unit)}°`} icon="🌡️" />
                    <DetailItem label="Humidity" value={`${weather.main.humidity}%`} icon={<HumidityIcon />} />
                    <DetailItem label="Wind" value={`${weather.wind.speed} m/s, ${getWindDirection(weather.wind.deg)}`} icon={<WindIcon />} />
                    <DetailItem label="Visibility" value={getVisibilityValue(weather.visibility)} icon={<VisibilityIcon />} />
                    <DetailItem label="Pressure" value={`${weather.main.pressure} hPa`} icon="💨" />
                    <DetailItem label="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} icon={<SunriseIcon />} />
                    <DetailItem label="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} icon={<SunsetIcon />} />
                  </div>
                </div>
              </div>
            </div>

            {/* Outfit Recommendation Section */}
            <OutfitRecommendation weatherData={weather} unit={unit} theme={theme} />

            {/* Map Component - Centered below main weather card */}
            {showMap && (
              <div className="w-full max-w-4xl mx-auto">
                <WeatherMap 
                  onLocationSelect={handleMapLocationSelect}
                  theme={theme}
                  isVisible={showMap}
                />
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-500/80 backdrop-blur-sm rounded-xl p-4 max-w-md text-center border border-red-300">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;