'use client'; // This is a client component

import React from 'react';
import { useData } from '@/context/DataContext';

export default function InsightsPanel() {
  const { getInsights } = useData();
  const insight = getInsights();

  return (
    <div className="p-6 bg-purple-50 rounded-lg shadow-md border-l-4 border-purple-400 flex flex-col justify-center items-center text-center">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4">AI Insights</h2>
      <p className="text-gray-700 text-lg leading-relaxed">{insight}</p>
    </div>
  );
}
