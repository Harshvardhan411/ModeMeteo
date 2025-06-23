import React from 'react';
import { getOutfitRecommendation } from './Helper.jsx';

const OutfitRecommendation = ({ weatherData, unit, theme }) => {
  if (!weatherData) return null;

  const recommendation = getOutfitRecommendation(weatherData, unit);

  const getComfortIcon = (comfortLevel) => {
    if (comfortLevel.includes('Very Cold') || comfortLevel.includes('Cold')) return '🥶';
    if (comfortLevel.includes('Cool')) return '😊';
    if (comfortLevel.includes('Mild')) return '😌';
    if (comfortLevel.includes('Warm')) return '😅';
    if (comfortLevel.includes('Hot')) return '🥵';
    return '👕';
  };

  const getWeatherIcon = (condition) => {
    const weather = condition.toLowerCase();
    if (weather.includes('rain')) return '🌧️';
    if (weather.includes('snow')) return '❄️';
    if (weather.includes('cloud')) return '☁️';
    if (weather.includes('clear')) return '☀️';
    if (weather.includes('thunder')) return '⛈️';
    return '👕';
  };

  return (
    <div className={`rounded-2xl p-6 ${theme.detailCard} backdrop-blur-sm border ${theme.borderColor} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${theme.textColor} flex items-center gap-2`}>
          <span className="text-2xl">👗</span>
          Outfit Recommendations
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getComfortIcon(recommendation.comfortLevel)}</span>
          <span className="text-2xl">{getWeatherIcon(weatherData.weather[0].main)}</span>
        </div>
      </div>

      {/* Comfort Level */}
      <div className={`mb-4 p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌡️</span>
          <span className={`font-semibold ${theme.textColor}`}>Comfort Level</span>
        </div>
        <p className={`text-sm ${theme.subtextColor}`}>{recommendation.comfortLevel}</p>
      </div>

      {/* Colors Section */}
      <div className="mb-4">
        <h4 className={`font-semibold mb-3 ${theme.textColor} flex items-center gap-2`}>
          <span className="text-lg">🎨</span>
          Recommended Colors
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👕</span>
              <span className={`text-sm font-medium ${theme.textColor}`}>Top</span>
            </div>
            <ul className={`text-xs space-y-1 ${theme.subtextColor}`}>
              {recommendation.colors.top.map((color, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></span>
                  {color}
                </li>
              ))}
            </ul>
          </div>
          <div className={`p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👖</span>
              <span className={`text-sm font-medium ${theme.textColor}`}>Bottom</span>
            </div>
            <ul className={`text-xs space-y-1 ${theme.subtextColor}`}>
              {recommendation.colors.bottom.map((color, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></span>
                  {color}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="mb-4">
        <h4 className={`font-semibold mb-3 ${theme.textColor} flex items-center gap-2`}>
          <span className="text-lg">🧵</span>
          Recommended Materials
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👕</span>
              <span className={`text-sm font-medium ${theme.textColor}`}>Top</span>
            </div>
            <ul className={`text-xs space-y-1 ${theme.subtextColor}`}>
              {recommendation.materials.top.map((material, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></span>
                  {material}
                </li>
              ))}
            </ul>
          </div>
          <div className={`p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👖</span>
              <span className={`text-sm font-medium ${theme.textColor}`}>Bottom</span>
            </div>
            <ul className={`text-xs space-y-1 ${theme.subtextColor}`}>
              {recommendation.materials.bottom.map((material, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></span>
                  {material}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Advice Section */}
      <div className={`p-3 rounded-xl ${theme.card} border ${theme.borderColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">💡</span>
          <span className={`font-semibold ${theme.textColor}`}>Style Advice</span>
        </div>
        <p className={`text-sm leading-relaxed ${theme.subtextColor}`}>{recommendation.advice}</p>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">✨</span>
          <span className="font-semibold text-white">Quick Tips</span>
        </div>
        <ul className="text-xs space-y-1 text-white/80">
          <li>• Layer up in cold weather for better temperature control</li>
          <li>• Light colors reflect heat, dark colors absorb it</li>
          <li>• Natural fabrics like cotton and linen are breathable</li>
          <li>• Consider UV protection for sunny days</li>
        </ul>
      </div>
    </div>
  );
};

export default OutfitRecommendation; 