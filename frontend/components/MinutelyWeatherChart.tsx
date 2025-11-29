"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeatherData } from '../app/hooks/useWeatherApp';

interface MinutelyWeatherChartProps {
  minutely: WeatherData['minutely'];
}

export default function MinutelyWeatherChart({ minutely }: MinutelyWeatherChartProps) {
  if (!minutely || minutely.length === 0) {
    return <div className="chart-container">No minutely weather data available</div>;
  }

  // Limit to first 60 minutes for better readability
  const limitedMinutely = minutely.slice(0, 60);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = limitedMinutely.map((minute) => ({
    time: formatTime(minute.dt),
    precipitation: minute.precipitation,
  }));

  return (
    <div className="chart-container">
      <h3>Minutely Precipitation Forecast (60 minutes)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} interval="preserveStartEnd" />
          <YAxis label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="precipitation" 
            stroke="#3498db" 
            fill="#3498db" 
            fillOpacity={0.6}
            name="Precipitation (mm)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

