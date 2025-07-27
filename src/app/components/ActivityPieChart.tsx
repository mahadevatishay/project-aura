'use client'; // This is a client component

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext'; // Relative import

// Define some colors for the pie chart slices
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']; // Added more colors for variety

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
  payload: any; // Add payload to access original data if needed
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

  // Filter out activities with 0 count if any
  const filteredChartData = chartData.filter(data => data.value > 0);

  // Sort data so the largest slice is first (optional, for better visual appeal)
  filteredChartData.sort((a, b) => b.value - a.value);

  // Custom label rendering function for percentages inside slices
  // We'll use the default label prop for text outside, but if that still overlaps,
  // we can re-implement a custom label with more sophisticated positioning.
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieLabelRenderProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    // Only show label if slice is large enough
    if (percent * 100 > 5) { // Only label slices larger than 5%
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">Activity Distribution</h2>
      <div className="flex-grow flex items-center justify-center"> {/* Center content */}
        {filteredChartData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Log some activities to see their distribution!</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}> {/* Added margin to the chart */}
              <Pie
                data={filteredChartData}
                cx="50%"
                cy="50%"
                innerRadius={50} // Slightly larger inner radius
                outerRadius={90} // Slightly smaller outer radius
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel as any} // Use custom label for percentage inside
              >
                {filteredChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                wrapperClassName=""
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                itemStyle={{ color: '#555' }}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle" 
                wrapperStyle={{ overflowY: 'auto', maxHeight: '80%' }} // Allow scrolling for many items
                formatter={(value: string, entry: any, index: number) => (
                  <span className="text-gray-700 text-sm">{value} ({filteredChartData[index]?.value})</span> // Show count in legend
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
