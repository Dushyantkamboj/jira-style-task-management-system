import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { getFileUrl } from '../../services/api';
import Avatar from '../common/Avatar';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import {
  X,
  Trash2,
  Paperclip,
  Upload,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle,
  ExternalLink,
  Download,
  FileText,
  Image as ImageIcon,
  History,
  File,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export const TaskDetailModal = () => {
  const {
    selectedTask,
    setSelectedTask,
    isDetailOpen,
    setIsDetailOpen,
    updateTask,
    users,
    addAttachment,
    removeAttachment,
    setTaskToDelete,
    setIsDeleteOpen,
  } = useTasks();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Idea');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState([]);
  const [labelText, setLabelText] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sync state when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status || 'Idea');
      setPriority(selectedTask.priority || 'Medium');
      setAssignee(selectedTask.assignee?._id || selectedTask.assignee || '');
      setDueDate(
        selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : ''
      );
      setLabels(selectedTask.labels || []);
      setStatusNote('');
    }
  }, [selectedTask]);

  if (!isDetailOpen || !selectedTask) return null;

  const isAssignee =
    selectedTask.assignee &&
    (selectedTask.assignee._id === user?._id || selectedTask.assignee === user?._id);
  const isCreator =
    selectedTask.creator &&
    (selectedTask.creator._id === user?._id || selectedTask.creator === user?._id);
  const isAdmin = user?.role === 'admin';
  const canModify = isAssignee || isCreator || isAdmin;
  const canDelete = isCreator || isAdmin;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    try {
      await updateTask(selectedTask._id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignee: assignee || null,
        dueDate: dueDate || null,
        labels,
        statusNote: statusNote.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('attachments', file);
      });
      await addAttachment(selectedTask._id, formData);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

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

  const handleRemoveLabel = (tag) => {
    setLabels(labels.filter((l) => l !== tag));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-lg shadow-jira-modal w-full max-w-4xl border border-jira-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-jira-border bg-gray-50/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-jira-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {selectedTask.taskKey}
            </span>
            <StatusBadge status={status} />
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={() => {
                  setTaskToDelete(selectedTask);
                  setIsDeleteOpen(true);
                }}
                className="p-1.5 text-jira-gray hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="p-1.5 text-jira-subtle hover:text-jira-dark rounded hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Two Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="text-[11px] font-bold uppercase text-jira-subtle tracking-wider block mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!canModify}
                className="w-full text-base font-bold text-jira-dark px-3 py-1.5 border border-transparent hover:border-jira-border focus:border-jira-blue focus:outline-none rounded transition-all disabled:bg-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold uppercase text-jira-subtle tracking-wider block mb-1">
                Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canModify}
                placeholder="Add a detailed description..."
                className="w-full text-xs text-jira-dark p-3 border border-jira-border rounded-md focus:border-jira-blue focus:ring-1 focus:ring-jira-blue focus:outline-none transition-all disabled:bg-gray-50"
              />
            </div>

            {/* Attachments Section */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-jira-blue" />
                  <h3 className="text-xs font-bold text-jira-dark uppercase tracking-wider">
                    Attachments ({selectedTask.attachments?.length || 0})
                  </h3>
                </div>

                <label className="cursor-pointer text-xs font-semibold text-jira-blue hover:text-jira-blue-hover flex items-center gap-1 hover:underline">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Files</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploading && (
                <div className="text-xs text-jira-blue flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 border-2 border-jira-blue border-t-transparent rounded-full animate-spin" />
                  <span>Uploading files...</span>
                </div>
              )}

              {/* Attachments List */}
              {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTask.attachments.map((att) => {
                    const isImg = att.mimeType.startsWith('image/');
                    const fileUrl = getFileUrl(att.url);
                    return (
                      <div
                        key={att._id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-jira-border bg-gray-50/60 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isImg ? (
                            <img
                              src={fileUrl}
                              alt={att.originalName}
                              className="w-9 h-9 rounded object-cover border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded bg-blue-100 text-jira-blue flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-jira-dark truncate block hover:text-jira-blue hover:underline"
                              title={att.originalName}
                            >
                              {att.originalName}
                            </a>
                            <span className="text-[10px] text-jira-subtle block">
                              {formatFileSize(att.size)} • {formatDistanceToNow(new Date(att.uploadedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <a
                            href={fileUrl}
                            download={att.originalName}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-jira-subtle hover:text-jira-blue rounded"
                            title="Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => removeAttachment(selectedTask._id, att._id)}
                              className="p-1 text-jira-subtle hover:text-red-600 rounded"
                              title="Delete attachment"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center text-xs text-jira-subtle">
                  No files attached yet.
                </div>
              )}
            </div>

            {/* Status History & Audit Log (Requirement 2.4 & 5) */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-jira-blue" />
                <h3 className="text-xs font-bold text-jira-dark uppercase tracking-wider">
                  Status History & Activity
                </h3>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-200">
                {selectedTask.statusHistory && selectedTask.statusHistory.length > 0 ? (
                  selectedTask.statusHistory.map((hist, index) => (
                    <div key={index} className="flex items-start gap-3 relative pl-1">
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-jira-blue flex items-center justify-center flex-shrink-0 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-jira-blue" />
                      </div>
                      <div className="text-xs flex-1 bg-gray-50/70 p-2.5 rounded border border-gray-100">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <Avatar user={hist.changedBy} size="xs" />
                            <span className="font-semibold text-jira-dark">
                              {hist.changedBy?.name || 'User'}
                            </span>
                          </div>
                          <span className="text-[10px] text-jira-subtle">
                            {format(new Date(hist.changedAt), 'MMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        <div className="text-jira-gray">
                          Transitioned from{' '}
                          <span className="font-bold text-gray-700">{hist.fromStatus}</span>{' '}
                          to <span className="font-bold text-jira-blue">{hist.toStatus}</span>
                        </div>
                        {hist.note && (
                          <div className="mt-1 text-[11px] italic text-jira-subtle">
                            &quot;{hist.note}&quot;
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-jira-subtle pl-6">
                    No status transitions recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col) - Metadata side pane */}
          <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border border-jira-border self-start">
            <h4 className="text-xs font-bold text-jira-dark uppercase tracking-wider pb-2 border-b border-gray-200">
              Details
            </h4>

            {/* Workflow Status */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!canModify}
                className="w-full text-xs font-bold px-2.5 py-1.5 rounded border border-jira-border bg-white text-jira-dark focus:ring-1 focus:ring-jira-blue cursor-pointer disabled:opacity-60"
              >
                <option value="Idea">Idea</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={!canModify}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-jira-border bg-white text-jira-dark focus:ring-1 focus:ring-jira-blue cursor-pointer disabled:opacity-60"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                disabled={!canModify}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-jira-border bg-white text-jira-dark focus:ring-1 focus:ring-jira-blue cursor-pointer disabled:opacity-60"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter / Creator */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Reporter
              </label>
              <div className="flex items-center gap-2 py-1">
                <Avatar user={selectedTask.creator} size="xs" />
                <span className="text-xs font-medium text-jira-dark truncate">
                  {selectedTask.creator?.name || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={!canModify}
                className="w-full text-xs px-2.5 py-1.5 rounded border border-jira-border bg-white text-jira-dark focus:ring-1 focus:ring-jira-blue cursor-pointer disabled:opacity-60"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="text-[11px] font-bold text-jira-subtle uppercase block mb-1">
                Labels
              </label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-200 text-jira-dark px-1.5 py-0.5 rounded"
                  >
                    <span>{lbl}</span>
                    {canModify && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(lbl)}
                        className="text-gray-500 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {canModify && (
                <input
                  type="text"
                  placeholder="Add label & press Enter"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  onKeyDown={handleAddLabel}
                  className="w-full text-xs px-2 py-1 border border-jira-border rounded bg-white"
                />
              )}
            </div>

            {/* Timestamps */}
            <div className="pt-2 border-t border-gray-200 text-[10px] text-jira-subtle space-y-1">
              <div>
                Created: {format(new Date(selectedTask.createdAt), 'MMM d, yyyy h:mm a')}
              </div>
              <div>
                Updated: {format(new Date(selectedTask.updatedAt), 'MMM d, yyyy h:mm a')}
              </div>
            </div>

            {/* Save Button */}
            {canModify && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2 px-4 bg-jira-blue hover:bg-jira-blue-hover text-white text-xs font-bold rounded shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
