import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { useTasks } from '../../context/TaskContext';
import Avatar from '../common/Avatar';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import {
  Lightbulb,
  ListTodo,
  Clock,
  Eye,
  CheckCircle2,
  Layers,
  Flame,
  AlertTriangle,
  Activity as ActivityIcon,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export const Dashboard = () => {
  const { setSelectedTask, setIsDetailOpen } = useTasks();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-jira-bg">
        <div className="flex items-center gap-3 text-jira-gray">
          <div className="w-5 h-5 border-2 border-jira-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading Project Analytics...</span>
        </div>
      </div>
    );
  }

  const { overview, priorities, overdue, recentActivities } = data;

  const cards = [
    {
      title: 'Total Tasks',
      value: overview.total,
      icon: Layers,
      color: 'border-l-gray-600 bg-white text-gray-800',
      iconColor: 'text-gray-600 bg-gray-100',
    },
    {
      title: 'Idea Tasks',
      value: overview.idea,
      icon: Lightbulb,
      color: 'border-l-purple-500 bg-white text-purple-900',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'To Do Tasks',
      value: overview.toDo,
      icon: ListTodo,
      color: 'border-l-blue-500 bg-white text-blue-900',
      iconColor: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'In Progress Tasks',
      value: overview.inProgress,
      icon: Clock,
      color: 'border-l-amber-500 bg-white text-amber-900',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      title: 'In Review Tasks',
      value: overview.inReview,
      icon: Eye,
      color: 'border-l-teal-500 bg-white text-teal-900',
      iconColor: 'text-teal-600 bg-teal-100',
    },
    {
      title: 'Completed Tasks',
      value: overview.completed,
      icon: CheckCircle2,
      color: 'border-l-emerald-500 bg-white text-emerald-900',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-jira-bg">
      {/* Header */}
      <div className="mb-6">
        <div className="text-[11px] font-semibold text-jira-subtle uppercase tracking-wider">
          Reports & Analytics
        </div>
        <h1 className="text-2xl font-bold text-jira-dark tracking-tight">
          Project Dashboard
        </h1>
        <p className="text-xs text-jira-gray mt-1">
          Real-time metrics and progress tracking across all sprint workflows
        </p>
      </div>

      {/* 1. Overview Cards (6 Mandatory requirement cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-lg p-4 border border-jira-border border-l-4 shadow-sm hover:shadow-md transition-shadow ${card.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-jira-gray truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-md ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-jira-dark">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* 2. Middle Row: Completion Progress & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Completion Progress Card */}
        <div className="bg-white rounded-lg p-5 border border-jira-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-jira-dark flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-jira-blue" />
              <span>Sprint Completion Rate</span>
            </h3>
            <span className="text-sm font-extrabold text-emerald-600">
              {overview.completionRate}%
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overview.completionRate}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
            <div>
              <span className="text-jira-subtle block">Assigned to Me</span>
              <span className="text-base font-bold text-jira-dark">{overview.myAssigned}</span>
            </div>
            <div>
              <span className="text-jira-subtle block">Created by Me</span>
              <span className="text-base font-bold text-jira-dark">{overview.myCreated}</span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown Card */}
        <div className="bg-white rounded-lg p-5 border border-jira-border shadow-sm">
          <h3 className="text-sm font-bold text-jira-dark flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-red-500" />
            <span>Priority Breakdown</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { label: 'Critical', count: priorities.Critical, color: 'bg-red-600' },
              { label: 'High', count: priorities.High, color: 'bg-orange-500' },
              { label: 'Medium', count: priorities.Medium, color: 'bg-amber-400' },
              { label: 'Low', count: priorities.Low, color: 'bg-emerald-500' },
            ].map((p) => {
              const pct = overview.total > 0 ? Math.round((p.count / overview.total) * 100) : 0;
              return (
                <div key={p.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-jira-dark">{p.label}</span>
                    <span className="text-jira-subtle">
                      {p.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overdue / Urgent Alert Card */}
        <div className="bg-white rounded-lg p-5 border border-jira-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-jira-dark flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Overdue Issues ({overdue.count})</span>
            </h3>
          </div>

          {overdue.count > 0 ? (
            <div className="space-y-2.5">
              {overdue.tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailOpen(true);
                  }}
                  className="p-2.5 rounded border border-red-100 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-jira-blue mr-1.5 font-mono">
                      {task.taskKey}
                    </span>
                    <span className="font-medium text-jira-dark">{task.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 whitespace-nowrap">
                    Due {format(new Date(task.dueDate), 'MMM d')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-center text-jira-subtle text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-1" />
              <span className="font-semibold text-jira-dark">All Caught Up!</span>
              <span>No overdue tasks in this sprint.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Recent Activity Stream */}
      <div className="bg-white rounded-lg p-5 border border-jira-border shadow-sm">
        <h3 className="text-sm font-bold text-jira-dark flex items-center gap-2 mb-4">
          <ActivityIcon className="w-4 h-4 text-jira-blue" />
          <span>Recent Activity Stream</span>
        </h3>

        <div className="divide-y divide-gray-100">
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((act) => (
              <div key={act._id} className="py-3 flex items-start gap-3 text-xs">
                <Avatar user={act.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-jira-dark">
                    <span className="font-bold">{act.user?.name || 'User'}</span>{' '}
                    <span className="text-jira-gray">
                      {act.action === 'TASK_CREATED' && 'created task'}
                      {act.action === 'STATUS_CHANGED' && (
                        <>
                          moved <span className="font-semibold text-jira-dark">{act.taskKey}</span> to{' '}
                          <span className="font-semibold text-jira-blue">
                            {act.details?.to || 'new status'}
                          </span>
                        </>
                      )}
                      {act.action === 'TASK_ASSIGNED' && (
                        <>assigned {act.taskKey} to {act.details?.assignedTo}</>
                      )}
                      {act.action === 'ATTACHMENT_ADDED' && `attached file(s) to ${act.taskKey}`}
                      {act.action === 'ATTACHMENT_REMOVED' && `removed attachment from ${act.taskKey}`}
                      {act.action === 'TASK_DELETED' && `deleted ${act.taskKey}`}
                    </span>
                    {act.taskTitle && act.action !== 'TASK_DELETED' && (
                      <span className="font-medium text-jira-dark block truncate mt-0.5">
                        &quot;{act.taskTitle}&quot;
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-jira-subtle mt-0.5">
                    {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-jira-subtle text-xs">
              No recent activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
