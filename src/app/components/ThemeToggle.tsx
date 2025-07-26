'use client'; // page.tsx must be a client component now

import React from 'react'; // Import React
import MoodForm from '../components/MoodForm';
import MoodChart from '../components/MoodChart';
import InsightsPanel from '../components/InsightsPanel';
import ActivityPieChart from '../components/ActivityPieChart';
import ReminderMessage from '../components/ReminderMessage';
import ThemeToggle from '../components/ThemeToggle'; // Import ThemeToggle
import { DataProvider } from '../context/DataContext'; // Import DataProvider
import { ThemeProvider, useTheme } from '../context/ThemeContext'; // Import ThemeProvider and useTheme

export default function HomePage() {
  return (
    // Wrap the entire content with ThemeProvider and DataProvider here
    <ThemeProvider>
      <ThemeApplier /> {/* ThemeApplier needs to be inside ThemeProvider */}
      <DataProvider> {/* DataProvider should be inside ThemeProvider */}
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 sm:p-8 font-sans">
          <header className="mb-8 text-center relative">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Project Aura</h1> 
            <p className="text-lg mt-3">Your personal mood and productivity dashboard.</p> 
            
            {/* Theme Toggle Button: MOVED HERE, inside the ThemeProvider/DataProvider scope */}
            <div className="absolute top-0 right-0 p-4">
              <ThemeToggle />
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Reminder Message at the top */}
            <div className="lg:col-span-3">
              <ReminderMessage />
            </div>

            {/* Mood Form */}
            <div className="lg:col-span-1">
              <MoodForm />
            </div>
            
            {/* Mood Chart */}
            <div className="lg:col-span-2">
              <MoodChart />
            </div>

            {/* Activity Pie Chart */}
            <div className="lg:col-span-1">
              <ActivityPieChart />
            </div>
            
            {/* Insights Panel */}
            <div className="lg:col-span-2">
              <InsightsPanel />
            </div>
          </main>
        </div>
      </DataProvider>
    </ThemeProvider>
  );
}

// ThemeApplier component
function ThemeApplier() {
  const { theme } = useTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return null;
}
