// this function converts wind direction given in degrees.

export const getWindDirection = (deg) => {

    if (deg > 337.5 || deg <= 22.5) return 'N';
    if (deg > 22.5 && deg <= 67.5) return 'NE';
    if (deg > 67.5 && deg <= 112.5) return 'E';
    if (deg > 112.5 && deg <= 157.5) return 'SE';
    if (deg > 157.5 && deg <= 202.5) return 'S';
    if (deg > 202.5 && deg <= 247.5) return 'SW';
    if (deg > 247.5 && deg <= 292.5) return 'W';
    if (deg > 292.5 && deg <= 337.5) return 'NW';
};

// this function checks and return humidity levels 
export const getHumidityValue = (humidity) => {
    if (humidity < 30) return 'Low';
    if (humidity < 60) return 'Moderate';
    return 'High';
};

// this function gives visibility values
export const getVisibilityValue = (visibility) => {
    const km = visibility / 1000;
    return `${km.toFixed(1)} km`;
};

// this function converts temperature
export const convertTemperature = (temp, unit) => {
    if (unit === 'F') {
        return (temp * 9 / 5 + 32).toFixed(1);
    }
    return temp.toFixed(1);
};

// this function provides outfit recommendations based on weather conditions
export const getOutfitRecommendation = (weatherData, unit = 'C') => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind.speed;
    
    // Convert to Fahrenheit if needed for better categorization
    const tempF = unit === 'F' ? temp : (temp * 9/5) + 32;
    
    let recommendation = {
        colors: {
            top: [],
            bottom: []
        },
        materials: {
            top: [],
            bottom: []
        },
        advice: "",
        comfortLevel: ""
    };

    // Temperature-based recommendations
    if (tempF < 32) { // Below freezing
        recommendation.colors.top = ['Dark colors (black, navy, dark gray)', 'Bright colors for visibility'];
        recommendation.colors.bottom = ['Dark jeans', 'Black pants', 'Dark leggings'];
        recommendation.materials.top = ['Wool', 'Fleece', 'Thermal materials', 'Down jacket'];
        recommendation.materials.bottom = ['Thick denim', 'Fleece-lined pants', 'Thermal leggings'];
        recommendation.advice = "Layer up with thermal underwear and wear a heavy coat. Dark colors absorb heat better.";
        recommendation.comfortLevel = "Very Cold - Bundle up!";
    } else if (tempF < 50) { // Cold
        recommendation.colors.top = ['Warm colors (red, orange, yellow)', 'Dark colors (navy, black)'];
        recommendation.colors.bottom = ['Dark jeans', 'Black pants', 'Khaki pants'];
        recommendation.materials.top = ['Wool', 'Cotton blend', 'Fleece', 'Light jacket'];
        recommendation.materials.bottom = ['Denim', 'Cotton blend', 'Wool blend'];
        recommendation.advice = "Wear layers that you can remove. Warm colors can help psychologically.";
        recommendation.comfortLevel = "Cold - Layer appropriately";
    } else if (tempF < 65) { // Cool
        recommendation.colors.top = ['Earth tones (brown, beige, olive)', 'Pastels', 'Light blues'];
        recommendation.colors.bottom = ['Khaki', 'Light denim', 'Beige pants'];
        recommendation.materials.top = ['Cotton', 'Linen', 'Light wool', 'Light sweater'];
        recommendation.materials.bottom = ['Cotton', 'Light denim', 'Linen'];
        recommendation.advice = "Light layers work best. Earth tones are perfect for this temperature.";
        recommendation.comfortLevel = "Cool - Light layers recommended";
    } else if (tempF < 75) { // Mild
        recommendation.colors.top = ['Light colors (white, pastels)', 'Light blues', 'Soft pinks'];
        recommendation.colors.bottom = ['Light denim', 'White pants', 'Khaki shorts'];
        recommendation.materials.top = ['Cotton', 'Linen', 'Light cotton blend'];
        recommendation.materials.bottom = ['Cotton', 'Light denim', 'Linen'];
        recommendation.advice = "Light, breathable fabrics are ideal. Light colors reflect heat.";
        recommendation.comfortLevel = "Mild - Comfortable weather";
    } else if (tempF < 85) { // Warm
        recommendation.colors.top = ['White', 'Light pastels', 'Light grays'];
        recommendation.colors.bottom = ['Light denim', 'White shorts', 'Light khaki'];
        recommendation.materials.top = ['Cotton', 'Linen', 'Bamboo', 'Lightweight cotton'];
        recommendation.materials.bottom = ['Cotton', 'Linen', 'Light denim'];
        recommendation.advice = "Light colors and breathable fabrics to stay cool. Avoid dark colors.";
        recommendation.comfortLevel = "Warm - Light and breathable";
    } else { // Hot
        recommendation.colors.top = ['White', 'Very light pastels', 'Light yellow'];
        recommendation.colors.bottom = ['White', 'Light khaki', 'Light denim'];
        recommendation.materials.top = ['Cotton', 'Linen', 'Bamboo', 'Moisture-wicking fabrics'];
        recommendation.materials.bottom = ['Cotton', 'Linen', 'Lightweight materials'];
        recommendation.advice = "White and very light colors reflect heat. Choose moisture-wicking fabrics.";
        recommendation.comfortLevel = "Hot - Stay cool with light colors";
    }

    // Humidity adjustments
    if (humidity > 70) {
        recommendation.advice += " High humidity - choose moisture-wicking fabrics and avoid synthetic materials that trap sweat.";
        recommendation.materials.top = recommendation.materials.top.filter(material => 
            material.includes('Cotton') || material.includes('Linen') || material.includes('Bamboo') || material.includes('Moisture-wicking')
        );
    }

    // Weather condition adjustments
    if (weatherCondition.includes('rain')) {
        recommendation.advice += " Rain expected - consider water-resistant materials and darker colors that don't show water spots.";
        recommendation.materials.top.unshift('Water-resistant materials');
        recommendation.colors.top = recommendation.colors.top.filter(color => 
            !color.includes('White') && !color.includes('Light')
        );
    } else if (weatherCondition.includes('snow')) {
        recommendation.advice += " Snow expected - wear waterproof materials and bright colors for visibility.";
        recommendation.materials.top.unshift('Waterproof materials');
        recommendation.colors.top = ['Bright colors for visibility', 'Dark colors for warmth'];
    } else if (weatherCondition.includes('cloud')) {
        recommendation.advice += " Cloudy weather - you can wear slightly darker colors as they won't absorb as much heat.";
    }

    // Wind adjustments
    if (windSpeed > 10) {
        recommendation.advice += " Windy conditions - consider wind-resistant materials and secure clothing.";
        recommendation.materials.top.unshift('Wind-resistant materials');
    }

    return recommendation;
};