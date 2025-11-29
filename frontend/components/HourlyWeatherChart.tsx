"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeatherData } from '../app/hooks/useWeatherApp';

interface HourlyWeatherChartProps {
  hourly: WeatherData['hourly'];
}

export default function HourlyWeatherChart({ hourly }: HourlyWeatherChartProps) {
  if (!hourly || hourly.length === 0) {
    return <div className="chart-container">No hourly weather data available</div>;
  }

  // Limit to first 24 hours for better readability
  const limitedHourly = hourly.slice(0, 24);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = limitedHourly.map((hour) => ({
    time: formatTime(hour.dt),
    temp: Math.round(hour.temp),
    feelsLike: Math.round(hour.feels_like),
    humidity: hour.humidity,
    pressure: hour.pressure,
    windSpeed: hour.wind_speed,
    uvi: hour.uvi,
    precipitation: hour.pop * 100, // Convert to percentage
  }));

  return (
    <div className="chart-container">
      <h3>Hourly Weather Forecast (24 hours)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: '', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff6b6b" strokeWidth={2} name="Temperature (°C)" />
          <Line yAxisId="left" type="monotone" dataKey="feelsLike" stroke="#ffa500" strokeWidth={2} name="Feels Like (°C)" />
          <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#4ecdc4" strokeWidth={2} name="Humidity (%)" />
          <Line yAxisId="right" type="monotone" dataKey="precipitation" stroke="#95a5a6" strokeWidth={2} name="Precipitation Chance (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

