import React from 'react';
import Weather from './Weather';

const App = () => {
  return (
    <div style={{ textAlign: 'center', color: '#007bff' }}>
      <h1 style={{ marginBottom: '20px' }}>Weather Forecast App</h1>
      <Weather />
    </div>
  );
};

export default App;
