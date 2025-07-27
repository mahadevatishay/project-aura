'use client'; // page.tsx must be a client component now

import React from 'react'; // Import React
import MoodForm from './components/MoodForm';
import MoodChart from './components/MoodChart';
import InsightsPanel from './components/InsightsPanel';
import ActivityPieChart from './components/ActivityPieChart';
import ReminderMessage from './components/ReminderMessage';
// Removed: import ThemeToggle from './components/ThemeToggle';
import { DataProvider } from './context/DataContext';
// Removed: import { ThemeProvider, useTheme } from './context/ThemeContext';

export default function HomePage() {
  console.log('HomePage: Rendering'); // DEBUG LOG

  return (
    // Removed: <ThemeProvider> wrapper
    <DataProvider> {/* DataProvider should be here to wrap the content */}
      <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300 p-4 sm:p-8 font-sans"> {/* Removed dark: classes */}
        <header className="mb-8 text-center relative">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Project Aura</h1> 
          <p className="text-lg mt-3">Your personal mood and productivity dashboard.</p> 
          
          {/* Removed: Theme Toggle Button */}
          {/* <div className="absolute top-0 right-0 p-4">
            <ThemeToggle />
          </div> */}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="lg:col-span-3">
            <ReminderMessage />
          </div>

          <div className="lg:col-span-1">
            <MoodForm />
          </div>
          
          <div className="lg:col-span-2">
            <MoodChart />
          </div>

          <div className="lg:col-span-1">
            <ActivityPieChart />
          </div>
          
          <div className="lg:col-span-2">
            <InsightsPanel />
          </div>
        </main>
      </div>
    </DataProvider>
    // Removed: ThemeApplier component definition
  );
}
