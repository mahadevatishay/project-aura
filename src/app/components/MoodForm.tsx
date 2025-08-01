'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export default function MoodForm() {
  const { addEntry } = useData();
  const [mood, setMood] = useState(5);
  const [activities, setActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: mood,
      activities: activities.split(',').map(activity => activity.trim()).filter(activity => activity !== ''),
    };
    addEntry(newEntry);
    setMood(5);
    setActivities('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md max-w-sm mx-auto text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center">Log Your Day</h2>
      
      <div className="mb-6">
        <label htmlFor="mood-slider" className="block font-medium mb-3">
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
          style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties}
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="activities-input" className="block font-medium mb-3">
          Activities (comma-separated):
        </label>
        <input
          type="text"
          id="activities-input"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out bg-gray-50 text-gray-900 placeholder-gray-400"
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
