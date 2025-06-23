import React from "react";
import DefaultImage from "../assets/img1.jpg";

const WeatherBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <img
        src={DefaultImage}
        alt="Default background"
        className="w-full h-full object-cover opacity-100 pointer-events-none animate-fade-in"
        onError={(e) => {
          console.error("Image load failed", e);
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default WeatherBackground;