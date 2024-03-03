import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cb43c678b1885954657b30d1ad908d42`
      );
      setWeatherData(response.data);
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

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faSun} style={{ color: '#f7b733' }} />
              <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faSun} style={{ color: '#f7b733' }} />
              <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No weather data found.</p>
      )}
    </div>
  );
};

export default Weather;
