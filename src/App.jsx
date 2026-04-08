import React from 'react';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { MonthlyCalendar } from './components/calendar/MonthlyCalendar';
import { LogoHeader } from './components/layout/LogoHeader';
import { TestSupabase } from './components/TestSupabase'; // To test connection as requested

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <LogoHeader />
      
      <main className="main-content" style={{ marginLeft: 0, padding: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <TestSupabase />
        <AnalyticsDashboard />
        <MonthlyCalendar />
      </main>
    </div>
  );
}

export default App;
