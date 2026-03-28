import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { agentsAPI } from '../utils/api';
import icon1 from '../assets/images/icon1.png';
import icon2 from '../assets/images/icon2.png';
import icon3 from '../assets/images/icon3.png';
import icon4 from '../assets/images/icon4.png';
import icon5 from '../assets/images/icon5.png';

const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <span className="stat-label">{label}</span>
      <span className={`stat-icon stat-icon-${color}`}>{icon}</span>
    </div>
    <div className="stat-value">{value}</div>
    <div className={`stat-bar stat-bar-${color}`} />
  </div>
);

const QuickAction = ({ label, icon, to }) => (
  <Link to={to} className="quick-action-card">
    <div className="quick-action-icon">{icon}</div>
    <span className="quick-action-label">{label}</span>
  </Link>
);

const statusClass = (s) => {
  const map = { Pending: 'badge-pending', Assigned: 'badge-assigned', Active: 'badge-active', Completed: 'badge-completed', Closed: 'badge-closed', Cancelled: 'badge-cancelled' };
  return map[s] || 'badge-default';
};

const MOCK_ACTIVITY = [
  { id: 'INSP-10245', property: 'Greenview apartme...', agent: 'Bluenest reality', inspector: 'John Mathews', status: 'Pending', updated: '2 mins ago' },
  { id: 'INSP-10244', property: 'Palm residency - Villa', agent: 'Urbankey estates', inspector: 'Sarah Collins', status: 'Assigned', updated: '1 hour ago' },
  { id: 'INSP-10243', property: 'Lakeview towers', agent: 'Bluenest reality', inspector: 'Mark Robinson', status: 'Active', updated: 'Today, 11.30 AM' },
  { id: 'INSP-10242', property: 'Maple street house', agent: 'Primelet agents', inspector: 'Emma Watson', status: 'Completed', updated: '2 days ago' },
  { id: 'INSP-10241', property: 'Sunrise commercial complex', agent: 'Urbankey estates', inspector: 'David Lee', status: 'Closed', updated: '3 days ago' },
  { id: 'INSP-10240', property: 'Oakwood cottage', agent: 'Primelet agents', inspector: 'Emma Watson', status: 'Cancelled', updated: '5 days ago' },
];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalClients: 200, totalProperties: 10, totalInspections: 2, pendingInspections: 2, closedInspections: 10 });
  const [agentCount, setAgentCount] = useState(0);

  useEffect(() => {
    agentsAPI.getAll({ limit: 1 })
      .then(res => setAgentCount(res.data.pagination?.total || 0))
      .catch(() => {});
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">

          {/* Stats */}
          <div className="stats-grid">
            <StatCard label="Total Clients" value={stats.totalClients} color="green" icon={
              <img src={icon1} alt="Total Clients" width="46" height="46" />
            }/>
            <StatCard label="Total Properties" value={stats.totalProperties} color="green" icon={
              <img src={icon2} alt="Total Properties" width="46" height="46" />
            }/>
            <StatCard label="Total Inspections" value={stats.totalInspections} color="red" icon={
              <img src={icon4} alt="Total Inspections" width="46" height="46" />
            }/>
            <StatCard label="Pending Inspections" value={stats.pendingInspections} color="yellow" icon={
              <img src={icon3} alt="Pending Inspections" width="46" height="46" />
            }/>
            <StatCard label="Closed Inspections" value={stats.closedInspections} color="yellow" icon={
              <img src={icon5} alt="Closed Inspections" width="46" height="46" />
            }/>
          </div>

          {/* Quick Actions */}
          <section className="section">
            <h2 className="section-title">Quick actions</h2>
            <div className="quick-actions-grid">
              <QuickAction label="Create Inspection" to="/inspections" icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              }/>
              <QuickAction label="Add Property" to="/properties" icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }/>
              <QuickAction label="Add Agent" to="/agents" icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }/>
              <QuickAction label="Add Inspector" to="/inspectors" icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }/>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Inspection ID</th>
                    <th>Property</th>
                    <th>Agent</th>
                    <th>Inspector</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ACTIVITY.map(row => (
                    <tr key={row.id}>
                      <td className="id-cell">{row.id}</td>
                      <td>{row.property}</td>
                      <td>{row.agent}</td>
                      <td>{row.inspector}</td>
                      <td><span className={`badge ${statusClass(row.status)}`}>{row.status}</span></td>
                      <td className="muted">{row.updated}</td>
                      <td>
                        <button className="action-link">
                          {row.status === 'Completed' ? 'View Report' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
