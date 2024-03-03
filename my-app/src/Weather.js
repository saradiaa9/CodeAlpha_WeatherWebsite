import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet library

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapContainerRef = useRef(null); // Ref for map container

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch current weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cb43c678b1885954657b30d1ad908d42`
      );
      setWeatherData(weatherResponse.data);

      // Fetch forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=cb43c678b1885954657b30d1ad908d42`
      );
      // Filter forecast data for the next 5 days
      const filteredForecastData = forecastResponse.data.list.filter((item, index) => index % 8 === 1);
      setForecastData(filteredForecastData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const getIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <FontAwesomeIcon icon={faSun} style={{ color: '#f7b733' }} />;
      case 'Clouds':
        return <FontAwesomeIcon icon={faCloud} style={{ color: '#a4b0be' }} />;
      case 'Rain':
        return <FontAwesomeIcon icon={faCloudRain} style={{ color: '#4834d4' }} />;
      case 'Snow':
        return <FontAwesomeIcon icon={faSnowflake} style={{ color: '#74b9ff' }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Check if the weather data and map container ref are available
    if (weatherData && mapContainerRef.current) {
      // Remove existing map instance if it exists
      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }
      
      // Initialize the map
      const map = L.map(mapContainerRef.current).setView([weatherData.coord.lat, weatherData.coord.lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      L.marker([weatherData.coord.lat, weatherData.coord.lon]).addTo(map);
    }
  }, [weatherData]);
  

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px', paddingRight: '20px' }}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Get Weather
            </button>
          </div>
        </form>
        {loading ? (
          <p>Loading weather data...</p>
        ) : weatherData ? (
          <div style={{ marginTop: '20px' }}>
            <h2> {weatherData.name}</h2>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginLeft:"169px", display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {getIcon(weatherData.weather[0].main)}
                <p> {weatherData.weather[0].main}</p>
              </div>
              <div>
                <p>Temperature: {weatherData.main.temp}°C</p>
                <p>Feels like: {weatherData.main.feels_like}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Pressure: {weatherData.main.pressure}</p>
                <p>Wind Speed: {weatherData.wind.speed}m/s</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No weather data found.</p>
        )}
        {/* Display forecast data */}
        {forecastData.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Forecast for the Next 5 Days</h3>
            {forecastData.map((item, index) => (
              <div key={index}>
                {new Date(item.dt * 1000).toLocaleDateString()}: {item.weather[0].main}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div ref={mapContainerRef} style={{ height: '400px' , marginTop: "90px"}}></div>
      </div>
    </div>
  );
  
};

export default Weather;
