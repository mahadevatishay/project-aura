import MoodForm from './components/MoodForm'; 
import MoodChart from './components/MoodChart';
import InsightsPanel from './components/InsightsPanel'; 

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">Project Aura</h1>
        <p className="text-lg text-gray-600 mt-3">Your personal mood and productivity dashboard.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-1">
          <MoodForm />
        </div>
        <div className="lg:col-span-2">
          <MoodChart />
        </div>
        <div className="lg:col-span-3">
          <InsightsPanel />
        </div>
      </main>
    </div>
  );
}
