import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tasksAPI, usersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    assignee: 'all',
    scope: 'all', // 'all', 'assigned_to_me', 'created_by_me'
    label: '',
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'info', 'warning'
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Fetch all registered users for assignees
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await usersAPI.getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err.message);
    }
  }, [isAuthenticated]);

  // Fetch tasks with current filters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.assignee !== 'all') params.assignee = filters.assignee;
      if (filters.scope !== 'all') params.scope = filters.scope;
      if (filters.label) params.label = filters.label;

      const res = await tasksAPI.getTasks(params);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters, showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchUsers();
    } else {
      setTasks([]);
      setUsers([]);
    }
  }, [isAuthenticated, fetchTasks, fetchUsers]);

  // Create Task
  const createTask = async (formData) => {
    try {
      const res = await tasksAPI.createTask(formData);
      if (res.data.success) {
        setTasks((prev) => [res.data.task, ...prev]);
        showToast(`Task ${res.data.task.taskKey} created successfully!`, 'success');
        setIsCreateOpen(false);
        return res.data.task;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  // Update Task details
  const updateTask = async (id, data) => {
    try {
      const res = await tasksAPI.updateTask(id, data);
      if (res.data.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
        if (selectedTask && selectedTask._id === id) {
          setSelectedTask(res.data.task);
        }
        showToast('Task updated successfully', 'success');
        return res.data.task;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  // Optimistic Move / Drag-and-Drop Task update
  const moveTask = async (taskId, targetStatus, targetIndex) => {
    // Permission guard in frontend before optimistic update
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const isAssignee = task.assignee && (task.assignee._id === user?._id || task.assignee === user?._id);
    const isCreator = task.creator && (task.creator._id === user?._id || task.creator === user?._id);
    const isAdmin = user?.role === 'admin';

    if (!isAssignee && !isCreator && !isAdmin) {
      showToast(
        'Permission denied: You can only move tasks assigned to you or created by you.',
        'error'
      );
      return;
    }

    const previousTasks = [...tasks];

    // Optimistically update local state
    setTasks((current) => {
      return current.map((t) => {
        if (t._id === taskId) {
          return {
            ...t,
            status: targetStatus,
            order: targetIndex,
          };
        }
        return t;
      });
    });

    try {
      const res = await tasksAPI.updateTaskStatus(taskId, {
        status: targetStatus,
        order: targetIndex,
      });

      if (res.data.success) {
        // Sync with full backend populated payload
        setTasks((current) => current.map((t) => (t._id === taskId ? res.data.task : t)));
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask(res.data.task);
        }
      }
    } catch (err) {
      // Revert optimistic update
      setTasks(previousTasks);
      const msg = err.response?.data?.message || 'Failed to update task status';
      showToast(msg, 'error');
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await tasksAPI.deleteTask(id);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        if (selectedTask && selectedTask._id === id) {
          setSelectedTask(null);
          setIsDetailOpen(false);
        }
        setIsDeleteOpen(false);
        setTaskToDelete(null);
        showToast('Task permanently deleted', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      showToast(msg, 'error');
    }
  };

  // Attachments
  const addAttachment = async (taskId, formData) => {
    try {
      const res = await tasksAPI.addAttachment(taskId, formData);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, attachments: res.data.attachments } : t))
        );
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask((prev) => ({ ...prev, attachments: res.data.attachments }));
        }
        showToast('Attachment uploaded successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error');
    }
  };

  const removeAttachment = async (taskId, attachmentId) => {
    try {
      const res = await tasksAPI.deleteAttachment(taskId, attachmentId);
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, attachments: res.data.attachments } : t))
        );
        if (selectedTask && selectedTask._id === taskId) {
          setSelectedTask((prev) => ({ ...prev, attachments: res.data.attachments }));
        }
        showToast('Attachment removed', 'info');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove attachment', 'error');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        users,
        loading,
        filters,
        setFilters,
        selectedTask,
        setSelectedTask,
        isCreateOpen,
        setIsCreateOpen,
        isDetailOpen,
        setIsDetailOpen,
        isDeleteOpen,
        setIsDeleteOpen,
        taskToDelete,
        setTaskToDelete,
        toast,
        showToast,
        fetchTasks,
        fetchUsers,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
        addAttachment,
        removeAttachment,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
