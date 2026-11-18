import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import Avatar from '../common/Avatar';
import { format, isPast, isToday } from 'date-fns';
import {
  Search,
  Paperclip,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Calendar,
} from 'lucide-react';

export const TaskListView = () => {
  const {
    tasks,
    filters,
    setFilters,
    setSelectedTask,
    setIsDetailOpen,
    setTaskToDelete,
    setIsDeleteOpen,
  } = useTasks();
  const { user } = useAuth();

  const [sortField, setSortField] = useState('taskKey');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'assignee') {
      aVal = a.assignee?.name || '';
      bVal = b.assignee?.name || '';
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* List Header */}
      <div className="border-b border-jira-border px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-white shadow-sm">
        <div>
          <div className="text-[11px] font-semibold text-jira-subtle uppercase tracking-wider">
            Projects / JiraFlow / List
          </div>
          <h1 className="text-xl font-bold text-jira-dark tracking-tight">
            All Issues ({tasks.length})
          </h1>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-jira-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search list..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-8 pr-4 py-1.5 text-xs bg-gray-50 border border-jira-border rounded text-jira-dark placeholder-jira-subtle focus:bg-white focus:outline-none focus:ring-1 focus:ring-jira-blue"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-jira-bg/70 sticky top-0 z-10 border-b border-jira-border text-jira-gray uppercase font-bold text-[11px] tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('taskKey')}
                className="py-3 px-4 cursor-pointer hover:text-jira-dark"
              >
                <div className="flex items-center gap-1">
                  <span>Key</span>
                  {sortField === 'taskKey' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('title')}
                className="py-3 px-4 cursor-pointer hover:text-jira-dark"
              >
                <div className="flex items-center gap-1">
                  <span>Title</span>
                  {sortField === 'title' &&
                    (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-jira-dark"
              >
                <span>Status</span>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="py-3 px-4 cursor-pointer hover:text-jira-dark"
              >
                <span>Priority</span>
              </th>
              <th className="py-3 px-4">Assignee</th>
              <th
                onClick={() => handleSort('dueDate')}
                className="py-3 px-4 cursor-pointer hover:text-jira-dark"
              >
                <span>Due Date</span>
              </th>
              <th className="py-3 px-4 text-center">Files</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedTasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                task.status !== 'Completed' &&
                isPast(new Date(task.dueDate)) &&
                !isToday(new Date(task.dueDate));

              const canDelete =
                task.creator && (task.creator._id === user?.id || task.creator === user?.id || user?.role === 'admin');

              return (
                <tr
                  key={task._id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailOpen(true);
                  }}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-jira-blue whitespace-nowrap">
                    {task.taskKey}
                  </td>
                  <td className="py-3 px-4 font-medium text-jira-dark max-w-md">
                    <div className="truncate font-semibold group-hover:text-jira-blue transition-colors">
                      {task.title}
                    </div>
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.labels.map((l, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-gray-100 text-jira-gray px-1.5 py-0.2 rounded"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar user={task.assignee} size="xs" />
                      <span className="text-jira-dark font-medium truncate max-w-[120px]">
                        {task.assignee ? task.assignee.name : 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <span
                        className={`inline-flex items-center gap-1 ${
                          isOverdue ? 'text-red-600 font-bold' : 'text-jira-gray'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-jira-subtle">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {task.attachments && task.attachments.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-jira-gray">
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachments.length}</span>
                      </span>
                    ) : (
                      <span className="text-jira-subtle">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDetailOpen(true);
                        }}
                        className="p-1 text-jira-gray hover:text-jira-blue rounded hover:bg-gray-100"
                        title="View details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => {
                            setTaskToDelete(task);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1 text-jira-gray hover:text-red-600 rounded hover:bg-red-50"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedTasks.length === 0 && (
          <div className="p-12 text-center text-jira-subtle">
            <p className="text-sm font-medium">No tasks found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListView;
