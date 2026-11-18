import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const KanbanColumn = ({ status, title, tasks, onCardClick }) => {
  const { setIsCreateOpen } = useTasks();

  const columnThemes = {
    Idea: {
      accent: 'border-t-purple-500',
      badge: 'bg-purple-100 text-purple-800',
      dot: 'bg-purple-500',
    },
    'To Do': {
      accent: 'border-t-blue-500',
      badge: 'bg-blue-100 text-blue-800',
      dot: 'bg-blue-500',
    },
    'In Progress': {
      accent: 'border-t-amber-500',
      badge: 'bg-amber-100 text-amber-800',
      dot: 'bg-amber-500',
    },
    'In Review': {
      accent: 'border-t-teal-500',
      badge: 'bg-teal-100 text-teal-800',
      dot: 'bg-teal-500',
    },
    Completed: {
      accent: 'border-t-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800',
      dot: 'bg-emerald-500',
    },
  };

  const theme = columnThemes[status] || columnThemes.Idea;

  return (
    <div
      className={`flex-shrink-0 w-72 sm:w-80 bg-jira-bg/90 rounded-lg flex flex-col border border-jira-border border-t-4 ${theme.accent} shadow-sm max-h-full`}
    >
      {/* Column Header */}
      <div className="p-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
          <h3 className="text-xs font-bold text-jira-dark uppercase tracking-wider">
            {title || status}
          </h3>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="p-1 rounded text-jira-subtle hover:text-jira-dark hover:bg-gray-200 transition-colors"
          title={`Add task in ${status}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Task List */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 overflow-y-auto min-h-[160px] transition-colors rounded-b-lg ${
              snapshot.isDraggingOver ? 'bg-blue-50/60 ring-2 ring-jira-blue/20' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onClick={onCardClick}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-28 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-jira-subtle text-xs p-4 text-center">
                <span>No issues in this column</span>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-1 text-jira-blue hover:underline font-semibold"
                >
                  + Add task
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
