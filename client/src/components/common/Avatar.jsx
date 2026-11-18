import React, { useState } from 'react';

export const Avatar = ({ user, size = 'sm', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const name = user?.name || 'Unassigned';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0052cc&textColor=ffffff`;

  if (!user) {
    return (
      <div
        title="Unassigned"
        className={`rounded-full border border-dashed border-gray-400 bg-gray-100 flex items-center justify-center text-gray-500 ${sizeClasses[size]} ${className}`}
      >
        <span className="text-[10px] font-bold">?</span>
      </div>
    );
  }

  return (
    <div
      title={`${name} (${user.email || user.jobTitle || 'Team Member'})`}
      className={`relative inline-block rounded-full ring-2 ring-white overflow-hidden shadow-sm flex-shrink-0 cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      {!imageError ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-jira-blue text-white flex items-center justify-center font-bold">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
