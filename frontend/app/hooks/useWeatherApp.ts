import { useState, useEffect } from 'react'
import { getWeatherData, getWeatherOverview } from '../api/WeatherData'
import { getCoordinatesByLocation } from '../api/Geocoding'
import { login, logout, getProfile, register } from '../api/Users'
import { getFavoriteLocations, createFavoriteLocation, deleteFavoriteLocation } from '../api/FavoriteLocations'

export function useWeatherApp() {
  const [searchInput, setSearchInput] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherOverview, setWeatherOverview] = useState<WeatherOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState<string>('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginData, setLoginData] = useState({ login: '', password: '', password_confirm: '', email: '' })
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([])
  const [currentLocation, setCurrentLocation] = useState<{ name: string; lat: number; lon: number } | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadFavorites()
  }, [isLoggedIn])

  // Helper functions
  async function checkAuthStatus() {
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const profile = await getProfile()
      setIsLoggedIn(true)
    
      
        setUsername(profile.username)
      
    } catch (err) {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUsername('')
    }
  }

  async function loadFavorites() {
    try {
      const data = await getFavoriteLocations()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load favorites:', err)
    }
  }

  function parseSearchInput(input: string): { type: 'coords' | 'name'; lat?: number; lon?: number; name?: string } {
    const trimmed = input.trim()
    const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/
    const match = trimmed.match(coordPattern)
    
    if (match) {
      return {
        type: 'coords',
        lat: parseFloat(match[1]),
        lon: parseFloat(match[2])
      }
    }
    
    return {
      type: 'name',
      name: trimmed
    }
  }

  function isLocationInFavorites() {
    if (!currentLocation) return false
    return favorites.some(f => 
      Math.abs(f.lat - currentLocation.lat) < 0.001 && 
      Math.abs(f.lon - currentLocation.lon) < 0.001
    )
  }

  function getTodayDate(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Handler functions
  async function handleSearch() {
    if (!searchInput.trim()) {
      setError('Please enter a location name or coordinates (lat,lon)')
      return
    }

    setError('')
    setLoading(true)

    try {
      const parsed = parseSearchInput(searchInput)
      let lat: number
      let lon: number
      let locationName: string = searchInput.trim()

      if (parsed.type === 'coords') {
        lat = parsed.lat!
        lon = parsed.lon!
      } else {
        const coordsData = await getCoordinatesByLocation(parsed.name!)
        lat = coordsData.lat
        lon = coordsData.lon
        locationName = coordsData.name || parsed.name!
      }

      const weather = await getWeatherData(lat.toString(), lon.toString())
      
      setWeatherData({
        ...weather,
        location: locationName,
        lat,
        lon
      })
      
      setCurrentLocation({ name: locationName, lat, lon })

      // Fetch weather overview
      try {
        const todayDate = getTodayDate()
        const overview = await getWeatherOverview(lat.toString(), lon.toString(), todayDate)
        setWeatherOverview(overview)
      } catch (overviewErr) {
        console.error('Failed to fetch weather overview:', overviewErr)
        setWeatherOverview(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data. Please check your input.')
      setWeatherData(null)
      setWeatherOverview(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    try {
      const response = await login({
        login: loginData.login,
        password: loginData.password
      })
      
      if (response.token) {
        setIsLoggedIn(true)
        setUsername(loginData.login)
        setShowLoginModal(false)
        setLoginData({ login: '', password: '', password_confirm: '', email: '' })
        await loadFavorites()
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  async function handleRegister() {
    // Client-side validation
    if (loginData.password.length < 12) {
      setError('Password must be at least 12 characters long.')
      return
    }

    if (loginData.password !== loginData.password_confirm) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    
    try {
      const response = await register({
        username: loginData.login,
        password: loginData.password,
        password_confirm: loginData.password_confirm,
        email: loginData.email
      })
      
      // Registration successful - close modal and update state
      if (response.token) {
        setIsLoggedIn(true)
        setUsername(loginData.login)
        await loadFavorites()
      }
      
      // Close modal on successful registration (no errors)
      setError('')
      setLoginData({ login: '', password: '', password_confirm: '', email: '' })
      setIsRegistering(false)
      setShowLoginModal(false)
    } catch (err: any) {
      // Handle API validation errors
      if (err && typeof err === 'object') {
        // Extract error messages from Django REST Framework error format
        const errorMessages: string[] = []
        for (const [key, value] of Object.entries(err)) {
          if (Array.isArray(value)) {
            errorMessages.push(...value.map((msg: string) => `${key}: ${msg}`))
          } else if (typeof value === 'string') {
            errorMessages.push(`${key}: ${value}`)
          } else if (Array.isArray(value)) {
            errorMessages.push(...value)
          }
        }
        setError(errorMessages.length > 0 ? errorMessages.join(', ') : 'Registration failed. Please try again.')
      } else {
        setError(err?.message || 'Registration failed. Please try again.')
      }
    }
  }

  async function handleLogout() {
    try {
      await logout({})
      setIsLoggedIn(false)
      setUsername('')
      setFavorites([])
      setCurrentLocation(null)
    } catch (err) {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUsername('')
      setFavorites([])
    }
  }

  async function handleAddToFavorites() {
    if (!currentLocation || !isLoggedIn) return

    try {
      const newFavorite = await createFavoriteLocation({
        location_name: currentLocation.name,
        lat: currentLocation.lat,
        lon: currentLocation.lon
      })
      
      setFavorites([...favorites, newFavorite])
    } catch (err: any) {
      setError(err.message || 'Failed to add to favorites')
    }
  }

  async function handleRemoveFavorite(id: number) {
    try {
      await deleteFavoriteLocation(id.toString())
      setFavorites(favorites.filter(f => f.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to remove favorite')
    }
  }

  async function handleFavoriteClick(favorite: FavoriteLocation) {
    setSearchInput(favorite.location_name)
    setCurrentLocation({ name: favorite.location_name, lat: favorite.lat, lon: favorite.lon })
    
    setLoading(true)
    setError('')
    
    try {
      const weather = await getWeatherData(favorite.lat.toString(), favorite.lon.toString())
      setWeatherData({
        ...weather,
        location: favorite.location_name,
        lat: favorite.lat,
        lon: favorite.lon
      })

      // Fetch weather overview
      try {
        const todayDate = getTodayDate()
        const overview = await getWeatherOverview(favorite.lat.toString(), favorite.lon.toString(), todayDate)
        setWeatherOverview(overview)
      } catch (overviewErr) {
        console.error('Failed to fetch weather overview:', overviewErr)
        setWeatherOverview(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data')
      setWeatherOverview(null)
    } finally {
      setLoading(false)
    }
  }

  return {
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
    handleLogin,
    handleRegister,
    handleLogout,
    handleAddToFavorites,
    handleRemoveFavorite,
    handleFavoriteClick,
    isLocationInFavorites
  }
}

// Types
export interface WeatherData {
  current?: {
    temp: number
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
    humidity: number
    wind_speed: number
  }
  daily?: Array<{
    dt: number
    sunrise: number
    sunset: number
    moonrise: number
    moonset: number
    temp: {
      day: number
      min: number
      max: number
      night: number
      eve: number
      morn: number
    }
    feels_like: {
      day: number
      night: number
      eve: number
      morn: number
    }
    pressure: number
    humidity: number
    dew_point: number
    wind_speed: number
    wind_deg: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    clouds: number
    pop: number
    uvi: number
  }>
  hourly?: Array<{
    dt: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust?: number
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    pop: number
  }>
  minutely?: Array<{
    dt: number
    precipitation: number
  }>
  location?: string
  lat?: number
  lon?: number
}

export interface FavoriteLocation {
  id: number
  location_name: string
  lat: number
  lon: number
  date_added: string
}

export interface WeatherOverview {
  lat: number
  lon: number
  tz?: string
  date?: string
  units?: string
  weather_overview: string
}
