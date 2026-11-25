// server/services/weatherService.js - Agro-Meteorological Weather & Advisory Service
export class WeatherService {
  static getAgroWeather(location = 'Warangal, Telangana') {
    const locLower = location.toLowerCase();

    // Regional weather presets for real farming locations
    const weatherData = {
      location: location,
      current: {
        temp: 31,
        feelsLike: 34,
        condition: 'Partly Cloudy with Scattered Showers',
        icon: '⛅',
        humidity: 68,
        windSpeed: '11 km/h ENE',
        rainfallProb: '35%',
        uvIndex: '6 (Moderate)',
        soilMoistureEst: 'Adequate (65%)',
        dewPoint: '24°C',
        updatedAt: 'Just now'
      },
      forecast7Days: [
        { day: 'Today', tempMax: 32, tempMin: 23, condition: 'Partly Cloudy', rainProb: '35%', advice: 'Good window for foliar spray before 11 AM' },
        { day: 'Tomorrow', tempMax: 31, tempMin: 22, condition: 'Light Rain / Drizzle', rainProb: '65%', advice: 'Postpone fertilizer top-dressing to prevent leaching' },
        { day: 'Day 3', tempMax: 29, tempMin: 22, condition: 'Moderate Showers', rainProb: '80%', advice: 'Check field drainage channels to prevent water stagnation' },
        { day: 'Day 4', tempMax: 30, tempMin: 23, condition: 'Scattered Clouds', rainProb: '25%', advice: 'Inspect crops for fungal spore outbreaks after rain' },
        { day: 'Day 5', tempMax: 33, tempMin: 24, condition: 'Sunny & Warm', rainProb: '10%', advice: 'Resume scheduled drip irrigation' },
        { day: 'Day 6', tempMax: 34, tempMin: 24, condition: 'Clear Sky', rainProb: '5%', advice: 'Ideal day for weeding and inter-cultivation' },
        { day: 'Day 7', tempMax: 33, tempMin: 23, condition: 'Partly Sunny', rainProb: '15%', advice: 'Normal farm operations' }
      ],
      farmingAdvisories: [
        {
          type: '🌧️ Rain Alert & Drainage',
          urgency: 'Medium',
          text: 'Rainfall expected over next 48 hours (estimated 25-40 mm). Inspect field bunds and ensure open outlets to prevent root waterlogging in cotton, tomato, and chilli.'
        },
        {
          type: '💨 Spraying Window Advisory',
          urgency: 'Favorable',
          text: 'Current wind speed (11 km/h) and humidity (68%) are within safe thresholds for pesticide/micronutrient foliar spray between 7:00 AM - 10:30 AM today.'
        },
        {
          type: '🦠 Disease Risk Warning',
          urgency: 'High',
          text: 'Warm temperatures (31°C) combined with high relative humidity (>65%) create favorable micro-climate conditions for fungal blast in paddy and anthracnose in chilli. Scout fields closely.'
        }
      ]
    };

    if (locLower.includes('punjab') || locLower.includes('khanna') || locLower.includes('ludhiana')) {
      weatherData.current.temp = 28;
      weatherData.current.condition = 'Clear and Sunny';
      weatherData.current.icon = '☀️';
      weatherData.current.humidity = 52;
      weatherData.current.rainfallProb = '10%';
    } else if (locLower.includes('guntur') || locLower.includes('andhra')) {
      weatherData.current.temp = 33;
      weatherData.current.condition = 'Humid & Sunny';
      weatherData.current.icon = '🌤️';
      weatherData.current.humidity = 72;
    } else if (locLower.includes('nashik') || locLower.includes('maharashtra')) {
      weatherData.current.temp = 27;
      weatherData.current.condition = 'Overcast with Cool Breeze';
      weatherData.current.icon = '☁️';
      weatherData.current.humidity = 75;
    }

    return weatherData;
  }
}
