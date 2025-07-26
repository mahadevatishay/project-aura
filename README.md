Project Aura: AI-Powered Mood & Productivity Dashboard
A personal dashboard to track mood and activities, with a rule-based engine to provide actionable insights.

Features
Daily Logging: Users can log their mood and activities for each day.

Data Visualization: A line chart displays mood trends over time.

AI Insights: A rule-based system analyzes user data and provides personalized recommendations.

Data Persistence: User data is saved locally in the browser's localStorage so it persists across sessions.

Responsive Design: Built with Tailwind CSS for a seamless experience on all devices.

Technologies Used
Framework: Next.js (with App Router)

Styling: Tailwind CSS

State Management: React Context API

Data Visualization: Recharts

Language: TypeScript

Simulated AI: Custom rule-based engine

Getting Started
To run this project locally:

Clone the repository:

git clone https://github.com/your-username/aura.git
cd aura

(Replace your-username/aura.git with your actual GitHub repository URL once you create it.)

Install dependencies:

npm install

Run the development server:

npm run dev

Open http://localhost:3000 in your browser to see the result.

Development Approach
This project was built following a phased approach to deliver a functional prototype quickly. A key design decision was to use a rule-based engine to simulate AI, which allowed for a fast implementation of the core concept without relying on a complex, external machine learning API. Data persistence is handled via localStorage for simplicity and immediate user experience.

Deployment
This application is designed to be easily deployed to Vercel. See the deployment steps below.