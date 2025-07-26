'use client'; // This is a client component

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the data structure for a single daily entry
interface DailyEntry {
  date: string;
  mood: number; // e.g., 1-5, or 1-10
  activities: string[];
}

// Define the shape of our context state
interface DataContextType {
  entries: DailyEntry[];
  addEntry: (newEntry: DailyEntry) => void;
  getInsights: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// A simple hook to use our context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  // Initialize state from localStorage or an empty array
  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (client-side)
      const savedEntries = localStorage.getItem('auraEntries');
      return savedEntries ? JSON.parse(savedEntries) : [];
    }
    return []; // Return empty array for server-side rendering
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auraEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = (newEntry: DailyEntry) => {
    setEntries((prevEntries) => {
      // Check if an entry for this date already exists
      const existingEntryIndex = prevEntries.findIndex(entry => entry.date === newEntry.date);
      if (existingEntryIndex > -1) {
        // Update existing entry
        const updatedEntries = [...prevEntries];
        updatedEntries[existingEntryIndex] = newEntry; // Overwrite with new entry
        return updatedEntries;
      }
      // Add new entry, ensuring chronological order (optional, but good for charts)
      const newEntries = [...prevEntries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return newEntries;
    });
  };

  // Rule-based insight engine
  const getInsights = (): string => {
    if (entries.length < 3) {
      return "Log a few more days to get personalized insights!";
    }

    // Sort entries by date to ensure insights are based on recent data
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastSevenEntries = sortedEntries.slice(-7); // Consider last 7 days for more robust insights

    // --- Rule 1: Consistent Low Mood ---
    const lowMoodThreshold = 4; // Mood below this is considered low
    const consecutiveLowMoodDays = lastSevenEntries.filter(entry => entry.mood <= lowMoodThreshold);
    if (consecutiveLowMoodDays.length >= 3) { // If 3 or more low mood days in the last 7
      return "Your mood has been consistently low recently. Consider reaching out to a friend, taking a mindful break, or engaging in a relaxing activity.";
    }

    // --- Rule 2: High Mood After Specific Activity ---
    const activityImpact: { [key: string]: { highMoodCount: number; totalCount: number; averageMood: number; moodSum: number } } = {};

    entries.forEach(entry => {
      entry.activities.forEach(activity => {
        const trimmedActivity = activity.toLowerCase();
        if (!activityImpact[trimmedActivity]) {
          activityImpact[trimmedActivity] = { highMoodCount: 0, totalCount: 0, averageMood: 0, moodSum: 0 };
        }
        activityImpact[trimmedActivity].totalCount++;
        activityImpact[trimmedActivity].moodSum += entry.mood;
        if (entry.mood > 7) { // Define "high mood"
          activityImpact[trimmedActivity].highMoodCount++;
        }
      });
    });

    for (const activity in activityImpact) {
      const stats = activityImpact[activity];
      if (stats.totalCount >= 2) { // Need at least 2 instances to suggest a pattern
        stats.averageMood = stats.moodSum / stats.totalCount;
        if (stats.averageMood >= 7.5 && stats.highMoodCount / stats.totalCount >= 0.75) { // High average mood and high success rate
          return `It seems "${activity}" consistently boosts your mood! Try to incorporate more of it into your routine.`;
        }
      }
    }

    // --- Rule 3: Low Productivity (if activities are sparse) ---
    const recentActivitiesCount = lastSevenEntries.reduce((sum, entry) => sum + entry.activities.length, 0);
    if (lastSevenEntries.length >= 5 && recentActivitiesCount < 5) { // If few activities logged over 5+ recent days
      return "You've logged fewer activities recently. Perhaps try setting one small, achievable goal for today to get started!";
    }

    // --- Default Insight ---
    return "Keep logging your days! Consistent data helps us provide better insights.";
  };

  const value = {
    entries,
    addEntry,
    getInsights,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
