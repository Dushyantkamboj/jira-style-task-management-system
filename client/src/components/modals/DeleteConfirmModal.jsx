import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmModal = () => {
  const { isDeleteOpen, setIsDeleteOpen, taskToDelete, setTaskToDelete, deleteTask } =
    useTasks();

  if (!isDeleteOpen || !taskToDelete) return null;

  const handleConfirm = async () => {
    await deleteTask(taskToDelete._id);
  };

  const handleCancel = () => {
    setIsDeleteOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-jira-modal w-full max-w-md border border-jira-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-jira-border bg-red-50/50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-bold">Permanently Delete Issue?</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-jira-subtle hover:text-jira-dark p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-xs text-jira-gray space-y-3">
          <p>
            You are about to permanently delete task{' '}
            <span className="font-mono font-bold text-jira-dark">
              {taskToDelete.taskKey}
            </span>{' '}
            (&quot;{taskToDelete.title}&quot;).
          </p>
          <p className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded text-[11px]">
            ⚠️ This will remove all associated attachments, status history, and comments. This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-jira-border bg-gray-50/70">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-xs font-semibold text-jira-gray hover:text-jira-dark hover:bg-gray-100 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded shadow-sm transition-colors"
          >
            Delete Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
