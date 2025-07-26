'use client'; // This is a client component

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';

export default function MoodForm() {
  const { addEntry } = useData();
  const [mood, setMood] = useState(5);
  const [activities, setActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split('T')[0], // Gets current date in YYYY-MM-DD format
      mood: mood,
      activities: activities.split(',').map(activity => activity.trim()).filter(activity => activity !== ''), // Split by comma, trim whitespace, filter out empty strings
    };
    addEntry(newEntry);
    setMood(5); // Reset mood slider
    setActivities(''); // Clear activities input
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Log Your Day</h2>
      
      <div className="mb-6">
        <label htmlFor="mood-slider" className="block text-gray-700 font-medium mb-3">
          Mood (1-10): <span className="text-blue-600 font-bold text-xl">{mood}</span>
        </label>
        <input
          type="range"
          id="mood-slider"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer thumb-blue-500"
          style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties} // Custom style for thumb color
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="activities-input" className="block text-gray-700 font-medium mb-3">
          Activities (comma-separated):
        </label>
        <input
          type="text"
          id="activities-input"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          placeholder="e.g., exercise, read, work"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
      >
        Submit Entry
      </button>
    </form>
  );
}
