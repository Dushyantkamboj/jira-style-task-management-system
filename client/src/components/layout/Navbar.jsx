import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import Avatar from '../common/Avatar';
import {
  Plus,
  Search,
  LogOut,
  SlidersHorizontal,
  FolderGit2,
  Menu,
  Shield,
  UserCheck,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar, activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const { setIsCreateOpen, filters, setFilters } = useTasks();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-jira-border sticky top-0 z-40 px-4 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Toggle & Project Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-gray-100 text-jira-gray lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveView('kanban')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Jira Icon */}
          <div className="w-8 h-8 rounded-lg bg-jira-blue flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V2h-10.58zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V7.8H5.79zm-5.74 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V13.6H.05z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-jira-dark tracking-tight leading-none text-base">
                JiraFlow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-jira-blue border border-blue-200">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-jira-subtle hidden sm:block">
              Software Project (JIRA)
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Global Quick Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-jira-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, or JIRA keys..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:bg-white focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right: + Create Button & Profile */}
      <div className="flex items-center gap-3">
        {/* "+ Create" Action Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-jira-blue hover:bg-jira-blue-hover text-white text-xs font-semibold rounded shadow-sm transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-jira-blue transition-all"
            title={`${user?.name} (${user?.email})`}
          >
            <Avatar user={user} size="sm" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-jira-modal border border-jira-border py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="font-semibold text-sm text-jira-dark truncate">{user?.name}</div>
                <div className="text-xs text-jira-gray truncate">{user?.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-jira-blue">
                    {user?.role === 'admin' ? 'Administrator' : 'Team Member'}
                  </span>
                  <span className="text-[11px] text-jira-subtle">{user?.department}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, scope: 'assigned_to_me' }));
                    setActiveView('kanban');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-jira-dark hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-jira-gray" />
                  <span>My Assigned Tasks</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-jira-dark hover:bg-gray-50 flex items-center gap-2"
                >
                  <FolderGit2 className="w-4 h-4 text-jira-gray" />
                  <span>Project Overview & Stats</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
