'use client'; // This is a client component

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext'; // Relative import

// Define some colors for the pie chart slices
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

// Define a type for the label data to satisfy TypeScript
interface PieLabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number; // This is the key property we are using
  name: string; // The name of the slice
  value: number; // The value of the slice
  x: number; // X coordinate for text
  y: number; // Y coordinate for text
  index: number; // Index of the slice
  // Add other properties if you use them
}

export default function ActivityPieChart() {
  const { entries } = useData();

  // Calculate activity frequencies
  const activityCounts: { [key: string]: number } = {};
  entries.forEach(entry => {
    entry.activities.forEach(activity => {
      const trimmedActivity = activity.trim().toLowerCase();
      if (trimmedActivity) { // Ensure activity is not empty
        activityCounts[trimmedActivity] = (activityCounts[trimmedActivity] || 0) + 1;
      }
    });
  });

  // Convert counts to an array for Recharts PieChart
  const chartData = Object.keys(activityCounts).map(activity => ({
    name: activity,
    value: activityCounts[activity],
  }));

  // Sort data so the largest slice is first (optional, for better visual appeal)
  chartData.sort((a, b) => b.value - a.value);

  // Custom label rendering function
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }: PieLabelRenderProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg h-full flex flex-col text-gray-900 dark:text-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-center">Activity Distribution</h2>
      <div className="flex-grow flex items-center justify-center"> {/* Center content */}
        {chartData.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Log some activities to see their distribution!</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80} // Adjust size as needed
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                // @ts-ignore // FIX: Suppress TypeScript error for this line
                label={renderCustomizedLabel} 
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                wrapperClassName="dark:bg-gray-700 dark:border-gray-600"
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" 
                formatter={(value, entry, index) => <span className="text-gray-700 dark:text-gray-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
