'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function ReminderMessage() {
  const { entries } = useData();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const lastEntryDate = entries.length > 0 ? entries[entries.length - 1].date : null;
    const today = new Date().toISOString().split('T')[0];

    if (!lastEntryDate || lastEntryDate !== today) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [entries]);

  if (!showMessage) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 rounded-lg shadow-md dark:shadow-lg mb-6 max-w-xl mx-auto text-center">
      <p className="font-semibold mb-2">👋 Don&apos;t forget to log your mood and activities today!</p> {/* FIX: Changed ' to &apos; */}
      <button
        onClick={() => setShowMessage(false)}
        className="text-sm text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 underline"
      >
        Dismiss
      </button>
    </div>
  );
}
