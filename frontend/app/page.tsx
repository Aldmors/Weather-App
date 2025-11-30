"use client";

import {useWeatherApp} from './hooks/useWeatherApp';
import DailyWeatherChart from '../components/DailyWeatherChart';
import HourlyWeatherChart from '../components/HourlyWeatherChart';
import MinutelyWeatherChart from '../components/MinutelyWeatherChart';

export default function Home() {
    const {
        searchInput,
        setSearchInput,
        weatherData,
        weatherOverview,
        loading,
        error,
        setError,
        isLoggedIn,
        username,
        showLoginModal,
        setShowLoginModal,
        isRegistering,
        setIsRegistering,
        loginData,
        setLoginData,
        favorites,
        currentLocation,
        handleSearch,
        handleCurrentLocation,
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
                <div className="header-left">
                    <h1>⛅ Weather App</h1>
                </div>
                <div className="header-right">
                    {isLoggedIn && username && (
                        <span className="username">{username}</span>
                    )}
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
                    <button onClick={handleCurrentLocation} disabled={loading} className="btn btn-secondary">
                        Get Current Location
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

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

                {/* Weather Display */}
                {weatherData && (
                    <div className="weather-info">
                        <h2>{weatherData.location || 'Weather Information'}</h2>
                        {(weatherData.lat !== undefined && weatherData.lon !== undefined) && (
                            <div className="location-coords">
                                {weatherData.lat.toFixed(6)}, {weatherData.lon.toFixed(6)}
                            </div>
                        )}
                        {weatherData.current && (
                            <>
                                <div className="weather-main">
                                    <div className="temp">
                                        {Math.round(weatherData.current.temp)}°C
                                    </div>
                                    {weatherData.current.weather && weatherData.current.weather[0] && (
                                        <div className="weather-details">
                                            <p><strong>Condition:</strong> {weatherData.current.weather[0].main}</p>
                                            <p>
                                                <strong>Description:</strong> {weatherData.current.weather[0].description}
                                            </p>
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
                        {weatherOverview && weatherOverview.weather_overview && (
                            <div className="weather-overview-description">
                                <p>{weatherOverview.weather_overview}</p>
                            </div>
                        )}
                        {weatherData.minutely && weatherData.minutely.length > 0 && (
                            <MinutelyWeatherChart minutely={weatherData.minutely}/>
                        )}
                        {weatherData.hourly && weatherData.hourly.length > 0 && (
                            <HourlyWeatherChart hourly={weatherData.hourly}/>
                        )}
                        {weatherData.daily && weatherData.daily.length > 0 && (
                            <DailyWeatherChart daily={weatherData.daily}/>
                        )}
                    </div>
                )}
            </main>

            {/* Login/Register Modal */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                        {error && (
                            <div className="error-message" style={{marginBottom: '1rem'}}>
                                {error}
                            </div>
                        )}
                        <div className="modal-form">
                            <input
                                type="text"
                                placeholder="Username"
                                value={loginData.login}
                                onChange={(e) => setLoginData({...loginData, login: e.target.value})}
                                className="modal-input"
                            />
                            {isRegistering && (
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    className="modal-input"
                                />
                            )}
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                className="modal-input"
                                onKeyPress={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
                            />
                            {isRegistering && (
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={loginData.password_confirm}
                                    onChange={(e) => setLoginData({...loginData, password_confirm: e.target.value})}
                                    className="modal-input"
                                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                                />
                            )}
                            {isRegistering && loginData.password.length > 0 && loginData.password.length < 12 && (
                                <div className="error-message"
                                     style={{fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem'}}>
                                    Password must be at least 12 characters long
                                </div>
                            )}
                            {isRegistering && loginData.password_confirm.length > 0 && loginData.password !== loginData.password_confirm && (
                                <div className="error-message"
                                     style={{fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem'}}>
                                    Passwords do not match
                                </div>
                            )}
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
                                        setLoginData({login: '', password: '', password_confirm: '', email: ''});
                                        setError('');
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
                                    setLoginData({login: '', password: '', password_confirm: '', email: ''});
                                    setError('');
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
