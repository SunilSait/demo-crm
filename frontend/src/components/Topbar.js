import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ searchPlaceholder = 'Search agents, Inspectors etc', onSearch }) => {
  const { user } = useAuth();
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="topbar">
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={e => onSearch && onSearch(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button className="notif-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot" />
        </button>

        <div className="user-profile">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{user?.full_name || 'Admin User'}</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
