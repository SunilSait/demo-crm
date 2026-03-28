import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const Placeholder = ({ title }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Topbar />
      <div className="page-content">
        <div className="placeholder-page">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bac3da" strokeWidth="1">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <h2>{title}</h2>
          <p>This page is coming soon.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Placeholder;
