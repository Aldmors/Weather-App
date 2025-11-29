"use client";

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {WeatherData} from '../app/hooks/useWeatherApp';

interface DailyWeatherChartProps {
    daily: WeatherData['daily'];
}

export default function DailyWeatherChart({daily}: DailyWeatherChartProps) {
    if (!daily || daily.length === 0) {
        return <div className="chart-container">No daily weather data available</div>;
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    };

    const chartData = daily.map((day) => ({
        date: formatDate(day.dt),
        maxTemp: Math.round(day.temp.max),
        minTemp: Math.round(day.temp.min),
        avgTemp: Math.round(day.temp.day),
        humidity: day.humidity,
        pressure: day.pressure,
        windSpeed: day.wind_speed,
        uvi: day.uvi,
    }));

    return (
        <div className="chart-container">
            <h3>Daily Weather Forecast</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis yAxisId="left" label={{value: 'Temperature (°C)', angle: -90, position: 'insideLeft'}}/>
                    <YAxis yAxisId="right" orientation="right" label={{value: '', angle: 90, position: 'insideRight'}}/>
                    <Tooltip/>
                    <Legend/>
                    <Line yAxisId="left" type="monotone" dataKey="maxTemp" stroke="#ff6b6b" strokeWidth={2}
                          name="Max Temp (°C)"/>
                    <Line yAxisId="left" type="monotone" dataKey="minTemp" stroke="#4ecdc4" strokeWidth={2}
                          name="Min Temp (°C)"/>
                    <Line yAxisId="left" type="monotone" dataKey="avgTemp" stroke="#45b7d1" strokeWidth={2}
                          name="Avg Temp (°C)"/>
                    <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#96ceb4" strokeWidth={2}
                          name="Humidity (%)"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

