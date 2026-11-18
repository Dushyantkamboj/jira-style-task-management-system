import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import {
  X,
  Paperclip,
  Upload,
  Calendar,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react';

export const CreateTaskModal = () => {
  const { isCreateOpen, setIsCreateOpen, createTask, users } = useTasks();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Idea');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [labelText, setLabelText] = useState('');
  const [labels, setLabels] = useState([]);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isCreateOpen) return null;

  const handleAddLabel = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = labelText.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !labels.includes(trimmed)) {
        setLabels([...labels, trimmed]);
        setLabelText('');
      }
    }
  };

  const handleRemoveLabel = (tagToRemove) => {
    setLabels(labels.filter((l) => l !== tagToRemove));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Task Description is required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('status', status);
      formData.append('priority', priority);
      if (dueDate) formData.append('dueDate', dueDate);
      if (assignee) formData.append('assignee', assignee);
      formData.append('labels', JSON.stringify(labels));

      files.forEach((file) => {
        formData.append('attachments', file);
      });

      await createTask(formData);
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('Idea');
      setPriority('Medium');
      setDueDate('');
      setAssignee('');
      setLabels([]);
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-jira-modal w-full max-w-2xl border border-jira-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-jira-border">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-jira-blue rounded text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <h2 className="text-base font-bold text-jira-dark">Create Issue</h2>
          </div>
          <button
            onClick={() => setIsCreateOpen(false)}
            className="text-jira-subtle hover:text-jira-dark p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-jira-dark mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth2 Google Login integration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-jira-dark mb-1">
              Task Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detailed explanation, steps to reproduce, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-jira-border rounded-md text-jira-dark placeholder-jira-subtle focus:outline-none focus:ring-2 focus:ring-jira-blue focus:border-transparent"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-jira-border rounded-md bg-white text-jira-dark font-medium focus:outline-none focus:ring-2 focus:ring-jira-blue cursor-pointer"
              >
                <option value="Idea">Idea</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-jira-border rounded-md bg-white text-jira-dark font-medium focus:outline-none focus:ring-2 focus:ring-jira-blue cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-jira-border rounded-md bg-white text-jira-dark font-medium focus:outline-none focus:ring-2 focus:ring-jira-blue cursor-pointer"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.jobTitle || u.department || 'Member'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-jira-dark mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-jira-border rounded-md bg-white text-jira-dark focus:outline-none focus:ring-2 focus:ring-jira-blue cursor-pointer"
              >
              </input>
            </div>
          </div>

          {/* Labels / Tags Input */}
          <div>
            <label className="block text-xs font-bold text-jira-dark mb-1">
              Labels / Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 border border-jira-border rounded-md bg-white min-h-[38px]">
              {labels.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-jira-dark px-2 py-0.5 rounded border border-gray-200"
                >
                  <Tag className="w-2.5 h-2.5 text-jira-subtle" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(tag)}
                    className="text-gray-400 hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={labels.length === 0 ? 'e.g. Frontend, Auth, Bug' : 'Add label...'}
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={handleAddLabel}
                className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          {/* File Attachments Dropzone */}
          <div>
            <label className="block text-xs font-bold text-jira-dark mb-1">
              Attachments (Images, PDF, Documents - up to 5 files)
            </label>
            <div className="border-2 border-dashed border-jira-border rounded-lg p-4 text-center hover:border-jira-blue transition-colors bg-gray-50/50">
              <input
                type="file"
                multiple
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-6 h-6 text-jira-blue mb-1" />
                <span className="text-xs font-semibold text-jira-dark">
                  Click to upload or drag and drop
                </span>
                <span className="text-[10px] text-jira-subtle mt-0.5">
                  PNG, JPG, PDF, DOCX, XLSX (max 15MB each)
                </span>
              </label>
            </div>

            {/* Selected files preview */}
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-jira-subtle flex-shrink-0" />
                      <span className="truncate font-medium text-jira-dark">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-jira-subtle flex-shrink-0">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-gray-400 hover:text-red-500 font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-jira-border">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-jira-gray hover:text-jira-dark hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-jira-blue hover:bg-jira-blue-hover text-white rounded shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating Issue...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
