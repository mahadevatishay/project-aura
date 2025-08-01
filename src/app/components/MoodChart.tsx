'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

export default function MoodChart() {
  const { entries } = useData();
  
  const chartData = entries.map(entry => ({
    name: entry.date,
    mood: entry.mood,
  })).reverse();

  return (
    // Chart container
    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">Mood Trends Over Time</h2>
      <div className="flex-grow">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Log some entries to see your mood trends!</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              {/* Grid lines */}
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              {/* X-axis labels */}
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#6b7280" />
              {/* Y-axis labels */}
              <YAxis domain={[0, 10]} label={{ value: 'Mood (1-10)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                wrapperClassName="" // Removed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
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
