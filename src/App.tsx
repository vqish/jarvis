import React from 'react';
import { useJarvis } from './state/JarvisContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { HardwareSimulator } from './components/hardware/HardwareSimulator';
import { DailyBriefingModal } from './components/briefing/DailyBriefingModal';
import { DashboardPage } from './pages/DashboardPage';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { TodayPlanPage } from './pages/TodayPlanPage';
import { TimetablePage } from './pages/TimetablePage';
import { TasksPage } from './pages/TasksPage';
import { FocusPage } from './pages/FocusPage';
import { QuizPage } from './pages/QuizPage';
import { NotesPage } from './pages/NotesPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { X } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, isSimulatorDrawerOpen, toggleSimulatorDrawer } = useJarvis();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'chat':
        return <div className="h-[calc(100vh-8rem)]"><ChatDrawer /></div>;
      case 'plan':
        return <TodayPlanPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'tasks':
        return <TasksPage />;
      case 'focus':
        return <FocusPage />;
      case 'quiz':
        return <QuizPage />;
      case 'notes':
        return <NotesPage />;
      case 'progress':
        return <ProgressPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <Navbar />

        {/* Dynamic Route View */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Right-Side Collapsible / Dockable Hardware Simulator Panel */}
      {isSimulatorDrawerOpen && (
        <div className="w-96 border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl p-5 shrink-0 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto z-40 animate-slideInRight">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-teal-400">
                PHYSICAL SIMULATION DOCK
              </span>
              <button
                onClick={() => toggleSimulatorDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <HardwareSimulator compact />
          </div>

          <div className="text-[10px] font-mono text-slate-500 text-center pt-4 border-t border-slate-800">
            JARVIS ESP32 WI-FI PROTOTYPE ENGINE
          </div>
        </div>
      )}

      {/* 4. Global Modals */}
      <DailyBriefingModal />
    </div>
  );
};
