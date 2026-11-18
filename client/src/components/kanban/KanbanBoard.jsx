import React, { useMemo } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import {
  Filter,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

const COLUMNS = [
  { id: 'Idea', title: 'Idea' },
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'In Review', title: 'In Review' },
  { id: 'Completed', title: 'Completed' },
];

export const KanbanBoard = () => {
  const {
    tasks,
    users,
    filters,
    setFilters,
    moveTask,
    setSelectedTask,
    setIsDetailOpen,
    loading,
  } = useTasks();
  const { user } = useAuth();

  // Group tasks by status
  const columnsData = useMemo(() => {
    const map = {
      Idea: [],
      'To Do': [],
      'In Progress': [],
      'In Review': [],
      Completed: [],
    };

    tasks.forEach((task) => {
      if (map[task.status]) {
        map[task.status].push(task);
      } else {
        map['Idea'].push(task);
      }
    });

    // Sort within column by order or createdAt
    Object.keys(map).forEach((col) => {
      map[col].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    return map;
  }, [tasks]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Dropped in exact same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const targetStatus = destination.droppableId;
    const targetIndex = destination.index;

    moveTask(draggableId, targetStatus, targetIndex);
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const hasActiveFilters =
    filters.search ||
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    filters.scope !== 'all' ||
    filters.label;

  const resetFilters = () => {
    setFilters({
      search: '',
      priority: 'all',
      assignee: 'all',
      scope: 'all',
      label: '',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-jira-bg">
      {/* Board Subheader: Title, Breadcrumb & Filters */}
      <div className="bg-white border-b border-jira-border px-6 py-3.5 flex-shrink-0 shadow-sm">
        {/* Title row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-[11px] font-semibold text-jira-subtle uppercase tracking-wider">
              Projects / JiraFlow / Kanban Board
            </div>
            <h1 className="text-xl font-bold text-jira-dark tracking-tight">
              Sprint Board
            </h1>
          </div>

          {/* Quick Stats in Header */}
          <div className="flex items-center gap-4 text-xs font-medium text-jira-gray">
            <div>
              Total: <span className="font-bold text-jira-dark">{tasks.length}</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div>
              Completed:{' '}
              <span className="font-bold text-emerald-600">
                {columnsData.Completed.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-jira-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-8 pr-7 py-1 text-xs bg-gray-50 border border-jira-border rounded text-jira-dark placeholder-jira-subtle focus:bg-white focus:outline-none focus:ring-1 focus:ring-jira-blue"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Assignee Filter Dropdown */}
          <div className="relative">
            <select
              value={filters.assignee}
              onChange={(e) => setFilters((prev) => ({ ...prev, assignee: e.target.value }))}
              className="pl-2.5 pr-8 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-jira-border rounded text-jira-dark font-medium focus:outline-none focus:ring-1 focus:ring-jira-blue cursor-pointer"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              <option value="me">Assigned to Me</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
              className="pl-2.5 pr-8 py-1 text-xs bg-gray-50 hover:bg-gray-100 border border-jira-border rounded text-jira-dark font-medium focus:outline-none focus:ring-1 focus:ring-jira-blue cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Quick "Only My Issues" toggle */}
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                scope: prev.scope === 'assigned_to_me' ? 'all' : 'assigned_to_me',
              }))
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
              filters.scope === 'assigned_to_me'
                ? 'bg-jira-blue text-white border-jira-blue'
                : 'bg-white hover:bg-gray-50 text-jira-dark border-jira-border'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Only My Issues</span>
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors font-medium"
              title="Clear all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Drag and Drop Columns Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full items-start">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                status={col.id}
                title={col.title}
                tasks={columnsData[col.id] || []}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
