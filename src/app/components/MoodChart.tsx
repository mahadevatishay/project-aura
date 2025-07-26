'use client'; // This is a client component

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/context/DataContext';

export default function MoodChart() {
  const { entries } = useData();
  
  // Format data for Recharts. We reverse the array to show the most recent data on the right.
  const chartData = entries.map(entry => ({
    name: entry.date, // X-axis label (date)
    mood: entry.mood, // Y-axis value (mood)
  })).reverse(); // Reverse to show most recent data on the right

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Mood Trends Over Time</h2>
      <div className="flex-grow"> {/* This div helps the chart take available space */}
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Log some entries to see your mood trends!</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} /> {/* Rotate labels for better readability */}
              <YAxis domain={[0, 10]} label={{ value: 'Mood (1-10)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8884d8" 
                strokeWidth={2} 
                activeDot={{ r: 8, fill: '#8884d8', stroke: '#8884d8', strokeWidth: 2 }} 
                dot={{ r: 4, fill: '#8884d8', stroke: 'none' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
