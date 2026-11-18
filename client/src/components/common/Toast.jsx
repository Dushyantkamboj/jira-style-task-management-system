import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast?.show) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    error: {
      bg: 'bg-red-50 border-red-300 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-blue-50 border-blue-300 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-xl">
      <div
        className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${config.bg} backdrop-blur-sm`}
      >
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div className="text-sm font-medium pr-2">{toast.message}</div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-auto -mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
