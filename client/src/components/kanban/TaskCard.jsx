import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Paperclip, Calendar, Lock } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import PriorityBadge from '../common/PriorityBadge';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

export const TaskCard = ({ task, index, onClick }) => {
  const { user } = useAuth();

  const isAssignee = task.assignee && (task.assignee._id === user?._id || task.assignee === user?._id);
  const isCreator = task.creator && (task.creator._id === user?._id || task.creator === user?._id);
  const isAdmin = user?.role === 'admin';
  const canModify = isAssignee || isCreator || isAdmin;

  // Format Due Date
  let dueDateText = null;
  let isOverdue = false;
  if (task.dueDate) {
    const due = new Date(task.dueDate);
    dueDateText = format(due, 'MMM d');
    isOverdue = task.status !== 'Completed' && isPast(due) && !isToday(due);
  }

  const attachmentCount = task.attachments ? task.attachments.length : 0;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`bg-white rounded-md p-3 mb-2.5 border transition-all cursor-pointer group select-none ${
            snapshot.isDragging
              ? 'kanban-dragging border-jira-blue shadow-jira-hover ring-2 ring-jira-blue/20'
              : 'border-jira-border hover:border-gray-400 hover:shadow-jira shadow-sm'
          }`}
        >
          {/* Header: Key & Priority */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-jira-gray tracking-wider group-hover:text-jira-blue transition-colors">
                {task.taskKey}
              </span>
              {!canModify && (
                <span title="Read-only: You are not assigned to or creator of this task">
                  <Lock className="w-3 h-3 text-jira-subtle" />
                </span>
              )}
            </div>
            <PriorityBadge priority={task.priority} showLabel={false} size="sm" />
          </div>

          {/* Title */}
          <h4 className="text-xs font-semibold text-jira-dark line-clamp-2 leading-snug mb-2 group-hover:text-jira-blue transition-colors">
            {task.title}
          </h4>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.labels.slice(0, 3).map((lbl, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-jira-gray border border-gray-200"
                >
                  {lbl}
                </span>
              ))}
              {task.labels.length > 3 && (
                <span className="text-[10px] text-jira-subtle font-medium self-center">
                  +{task.labels.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer: Due date, attachments, and Assignee */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-jira-subtle text-[11px]">
            <div className="flex items-center gap-2.5">
              {/* Due Date */}
              {dueDateText && (
                <div
                  className={`flex items-center gap-1 font-medium ${
                    isOverdue
                      ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 font-semibold'
                      : 'text-jira-gray'
                  }`}
                  title={isOverdue ? 'Task is overdue!' : `Due ${dueDateText}`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{dueDateText}</span>
                </div>
              )}

              {/* Attachment count */}
              {attachmentCount > 0 && (
                <div
                  className="flex items-center gap-0.5 text-jira-gray font-medium"
                  title={`${attachmentCount} attachment(s)`}
                >
                  <Paperclip className="w-3 h-3" />
                  <span>{attachmentCount}</span>
                </div>
              )}
            </div>

            {/* Assignee Avatar */}
            <div>
              <Avatar user={task.assignee} size="sm" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
