import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import {
  Kanban,
  ListTodo,
  LayoutDashboard,
  FolderKanban,
  UserCheck,
  UserPlus,
  Flame,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, activeView, setActiveView }) => {
  const { filters, setFilters, tasks } = useTasks();
  const { user } = useAuth();

  const totalCount = tasks.length;
  const myAssignedCount = tasks.filter(
    (t) => t.assignee && (t.assignee._id === user?.id || t.assignee === user?.id)
  ).length;
  const myCreatedCount = tasks.filter(
    (t) => t.creator && (t.creator._id === user?.id || t.creator === user?.id)
  ).length;

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleScopeChange = (scope) => {
    setFilters((prev) => ({ ...prev, scope }));
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-14 left-0 bottom-0 z-30 w-64 bg-jira-surface border-r border-jira-border flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Project Box */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-jira-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-jira-blue/10 border border-jira-blue/30 text-jira-blue flex items-center justify-center font-bold text-sm">
                JF
              </div>
              <div>
                <h2 className="text-xs font-bold text-jira-dark truncate">JiraFlow System</h2>
                <span className="text-[11px] text-jira-gray">Software Project</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1 text-jira-subtle hover:text-jira-dark rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Planning Views */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-jira-subtle px-2 mb-2">
              Work Views
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleNavClick('kanban')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'kanban'
                    ? 'bg-jira-blue/10 text-jira-blue font-semibold'
                    : 'text-jira-dark hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Kanban className="w-4 h-4 text-current" />
                  <span>Kanban Board</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 text-jira-dark font-bold">
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('list')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'list'
                    ? 'bg-jira-blue/10 text-jira-blue font-semibold'
                    : 'text-jira-dark hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ListTodo className="w-4 h-4 text-current" />
                  <span>List View</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-jira-blue/10 text-jira-blue font-semibold'
                    : 'text-jira-dark hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-current" />
                  <span>Dashboard & Metrics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Quick Scope Filters */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-jira-subtle px-2 mb-2">
              Quick Filters
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleScopeChange('all')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filters.scope === 'all'
                    ? 'bg-blue-50 text-jira-blue font-semibold'
                    : 'text-jira-gray hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Tasks</span>
                </div>
                <span className="text-[11px]">{totalCount}</span>
              </button>

              <button
                onClick={() => handleScopeChange('assigned_to_me')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filters.scope === 'assigned_to_me'
                    ? 'bg-blue-50 text-jira-blue font-semibold'
                    : 'text-jira-gray hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assigned to Me</span>
                </div>
                <span className="text-[11px] font-semibold">{myAssignedCount}</span>
              </button>

              <button
                onClick={() => handleScopeChange('created_by_me')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filters.scope === 'created_by_me'
                    ? 'bg-blue-50 text-jira-blue font-semibold'
                    : 'text-jira-gray hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Created by Me</span>
                </div>
                <span className="text-[11px]">{myCreatedCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-jira-border bg-gray-50/50 text-[11px] text-jira-subtle flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Atlas Connected</span>
          </div>
          <span className="font-mono text-[10px]">v1.0.0</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
