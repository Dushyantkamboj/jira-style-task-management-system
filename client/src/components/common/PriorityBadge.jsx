import React from 'react';
import { ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react';

export const PriorityBadge = ({ priority = 'Medium', showLabel = true, size = 'sm' }) => {
  const configs = {
    Critical: {
      color: 'text-red-700 bg-red-100 border-red-200',
      iconColor: 'text-red-600',
      icon: Flame,
      label: 'Critical',
    },
    High: {
      color: 'text-red-600 bg-red-50 border-red-200',
      iconColor: 'text-red-500',
      icon: ArrowUp,
      label: 'High',
    },
    Medium: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      iconColor: 'text-amber-500',
      icon: Minus,
      label: 'Medium',
    },
    Low: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-500',
      icon: ArrowDown,
      label: 'Low',
    },
  };

  const config = configs[priority] || configs.Medium;
  const IconComponent = config.icon;

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  const badgeSizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  if (!showLabel) {
    return (
      <span title={`Priority: ${config.label}`} className="inline-flex items-center">
        <IconComponent className={`${iconSizes[size]} ${config.iconColor}`} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border ${config.color} ${badgeSizes[size]}`}
    >
      <IconComponent className={`${iconSizes[size]} ${config.iconColor}`} />
      <span>{config.label}</span>
    </span>
  );
};

export default PriorityBadge;
