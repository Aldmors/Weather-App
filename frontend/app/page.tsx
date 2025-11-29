"use client";

import { useWeatherApp } from './hooks/useWeatherApp';
import DailyWeatherChart from '../components/DailyWeatherChart';
import HourlyWeatherChart from '../components/HourlyWeatherChart';
import MinutelyWeatherChart from '../components/MinutelyWeatherChart';

export default function Home() {
  const {
    searchInput,
    setSearchInput,
    weatherData,
    loading,
    error,
    isLoggedIn,
    showLoginModal,
    setShowLoginModal,
    isRegistering,
    setIsRegistering,
    loginData,
    setLoginData,
    favorites,
    currentLocation,
    handleSearch,
    handleLogin,
    handleRegister,
    handleLogout,
    handleAddToFavorites,
    handleRemoveFavorite,
    handleFavoriteClick,
    isLocationInFavorites
  } = useWeatherApp();

  return (
    <div className="container">
      <header>
        <h1>⛅ Weather App</h1>
        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
              Login
            </button>
          )}
        </div>
      </header>

      <main>
        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter city name or coordinates (lat,lon)"
            className="search-input"
          />
          <button onClick={handleSearch} disabled={loading} className="btn btn-primary">
            {loading ? 'Searching...' : 'Search Weather'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {/* Weather Display */}
        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.location || 'Weather Information'}</h2>
            {weatherData.current && (
              <>
                <div className="weather-main">
                  <div className="temp">
                    {Math.round(weatherData.current.temp)}°C
                  </div>
                  {weatherData.current.weather && weatherData.current.weather[0] && (
                    <div className="weather-details">
                      <p><strong>Condition:</strong> {weatherData.current.weather[0].main}</p>
                      <p><strong>Description:</strong> {weatherData.current.weather[0].description}</p>
                      <p><strong>Humidity:</strong> {weatherData.current.humidity}%</p>
                      <p><strong>Wind Speed:</strong> {weatherData.current.wind_speed} m/s</p>
                    </div>
                  )}
                </div>
                {isLoggedIn && currentLocation && !isLocationInFavorites() && (
                  <button onClick={handleAddToFavorites} className="btn btn-favorite">
                    ⭐ Add to Favorites
                  </button>
                )}
                {isLoggedIn && currentLocation && isLocationInFavorites() && (
                  <div className="already-favorite">✓ Already in favorites</div>
                )}
              </>
            )}

            {/* Weather Charts */}
            {weatherData.minutely && weatherData.minutely.length > 0 && (
              <MinutelyWeatherChart minutely={weatherData.minutely} />
            )}
            {weatherData.hourly && weatherData.hourly.length > 0 && (
              <HourlyWeatherChart hourly={weatherData.hourly} />
            )}
            {weatherData.daily && weatherData.daily.length > 0 && (
              <DailyWeatherChart daily={weatherData.daily} />
            )}
          </div>
        )}

        {/* Favorites Section */}
        {isLoggedIn && favorites.length > 0 && (
          <div className="favorites">
            <h3>📌 Favorite Locations</h3>
            <ul className="favorites-list">
              {favorites.map((fav) => (
                <li key={fav.id} className="favorite-item">
                  <button 
                    onClick={() => handleFavoriteClick(fav)} 
                    className="favorite-link"
                  >
                    {fav.location_name}
                  </button>
                  <button 
                    onClick={() => handleRemoveFavorite(fav.id)} 
                    className="btn-remove"
                    title="Remove from favorites"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isLoggedIn && favorites.length === 0 && (
          <div className="favorites">
            <p>No favorite locations yet. Search for a location and add it to your favorites!</p>
          </div>
        )}
      </main>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="modal-input"
              />
              {isRegistering && (
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="modal-input"
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="modal-input"
                onKeyPress={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
              />
              <div className="modal-actions">
                <button 
                  onClick={isRegistering ? handleRegister : handleLogin} 
                  className="btn btn-primary"
                >
                  {isRegistering ? 'Register' : 'Login'}
                </button>
                <button 
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setLoginData({ username: '', password: '', email: '' });
                  }} 
                  className="btn btn-link"
                >
                  {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
              </div>
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setIsRegistering(false);
                  setLoginData({ username: '', password: '', email: '' });
                }} 
                className="btn-close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
