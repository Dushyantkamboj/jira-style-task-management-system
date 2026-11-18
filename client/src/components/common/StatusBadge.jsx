import React from 'react';

export const StatusBadge = ({ status = 'Idea', size = 'sm' }) => {
  const configs = {
    Idea: {
      bg: 'bg-purple-100 text-purple-800 border-purple-200',
      dot: 'bg-purple-500',
    },
    'To Do': {
      bg: 'bg-blue-100 text-blue-800 border-blue-200',
      dot: 'bg-blue-500',
    },
    'In Progress': {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    'In Review': {
      bg: 'bg-teal-100 text-teal-800 border-teal-200',
      dot: 'bg-teal-500',
    },
    Completed: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    },
  };

  const config = configs[status] || configs.Idea;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md uppercase tracking-wider border ${config.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
