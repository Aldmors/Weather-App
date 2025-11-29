import { useState, useEffect } from 'react'
import { getWeatherData } from '../api/WeatherData'
import { getCoordinatesByLocation } from '../api/Geocoding'
import { login, logout, getProfile, register } from '../api/Users'
import { getFavoriteLocations, createFavoriteLocation, deleteFavoriteLocation } from '../api/FavoriteLocations'

export function useWeatherApp() {
  const [searchInput, setSearchInput] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '', email: '' })
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
      await getProfile()
      setIsLoggedIn(true)
    } catch (err) {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data. Please check your input.')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    try {
      const response = await login({
        username: loginData.username,
        password: loginData.password
      })
      
      if (response.token) {
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setLoginData({ username: '', password: '', email: '' })
        await loadFavorites()
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  async function handleRegister() {
    try {
      const response = await register({
        username: loginData.username,
        password: loginData.password,
        email: loginData.email
      })
      
      if (response.token) {
        setIsLoggedIn(true)
        setShowLoginModal(false)
        setIsRegistering(false)
        setLoginData({ username: '', password: '', email: '' })
        await loadFavorites()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  async function handleLogout() {
    try {
      await logout({})
      setIsLoggedIn(false)
      setFavorites([])
      setCurrentLocation(null)
    } catch (err) {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return {
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
