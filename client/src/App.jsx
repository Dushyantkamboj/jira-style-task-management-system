import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import KanbanBoard from './components/kanban/KanbanBoard';
import TaskListView from './components/list/TaskListView';
import Dashboard from './components/dashboard/Dashboard';
import CreateTaskModal from './components/modals/CreateTaskModal';
import TaskDetailModal from './components/modals/TaskDetailModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import Toast from './components/common/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const { toast, showToast } = useTasks();

  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeView, setActiveView] = useState('kanban'); // 'kanban', 'list', 'dashboard'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Session loading screen
  if (loading) {
    return (
      <div className="h-screen w-screen bg-jira-bg flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-jira-blue text-white flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.53 2c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V2h-10.58zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V7.8H5.79zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V13.6H.05z" />
          </svg>
        </div>
        <div className="text-sm font-bold text-jira-dark">Loading JiraFlow...</div>
      </div>
    );
  }

  // Not logged in -> Show Login or Register
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  // Logged in Workspace Layout
  return (
    <div className="min-h-screen flex flex-col bg-jira-bg">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'list' && <TaskListView />}
          {activeView === 'dashboard' && <Dashboard />}
        </main>
      </div>

      {/* Global Modals */}
      <CreateTaskModal />
      <TaskDetailModal />
      <DeleteConfirmModal />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => showToast('', '')} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </AuthProvider>
  );
}
