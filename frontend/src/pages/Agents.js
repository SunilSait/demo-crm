import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AgentModal from '../components/AgentModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { agentsAPI } from '../utils/api';

const StatusBadge = ({ status }) => {
  const map = { Active: 'badge-active-agent', Inactive: 'badge-inactive', Suspended: 'badge-suspended' };
  return <span className={`badge ${map[status] || 'badge-default'}`}>{status}</span>;
};

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, agent: null });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAgents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await agentsAPI.getAll({ page, limit: 12, search, status: statusFilter });
      setAgents(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      showToast('Failed to load agents.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchAgents(1), 300);
    return () => clearTimeout(timer);
  }, [fetchAgents]);

  const handleAddAgent = () => { setEditAgent(null); setModalOpen(true); };
  const handleEditAgent = (agent) => { setEditAgent(agent); setModalOpen(true); };
  const handleDeleteClick = (agent) => setDeleteDialog({ open: true, agent });

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (editAgent) {
        await agentsAPI.update(editAgent.id, formData);
        showToast('Agent updated successfully.');
      } else {
        await agentsAPI.create(formData);
        showToast('Agent added successfully.');
      }
      setModalOpen(false);
      fetchAgents(pagination.page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await agentsAPI.delete(deleteDialog.agent.id);
      showToast('Agent deleted successfully.');
      setDeleteDialog({ open: false, agent: null });
      fetchAgents(pagination.page);
    } catch {
      showToast('Failed to delete agent.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) fetchAgents(newPage);
  };

  const statuses = ['Active', 'Inactive', 'Suspended'];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">

          {toast && (
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
              {toast.msg}
            </div>
          )}

          {/* Toolbar */}
          <div className="page-toolbar">
            <div className="toolbar-left">
              {/* Inline search for agents — matches design reference */}
              <div className="agents-search-wrapper">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  className="agents-search-input"
                  placeholder="Search agents"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-right">
              <div className="status-filter-wrapper">
                <button
                  className="btn btn-filter"
                  onClick={() => setShowStatusDropdown(p => !p)}
                >
                  Status
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {statusFilter && <span className="filter-badge">{statusFilter}</span>}
                </button>
                {showStatusDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => { setStatusFilter(''); setShowStatusDropdown(false); }}>
                      All
                    </button>
                    {statuses.map(s => (
                      <button key={s} className={`dropdown-item ${statusFilter === s ? 'active' : ''}`}
                        onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={handleAddAgent}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Agents
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Properties</th>
                  <th>Inspections</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="table-loading">
                    <div className="spinner" />
                  </td></tr>
                ) : agents.length === 0 ? (
                  <tr><td colSpan="8" className="table-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c3c3c3" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <p>No agents found</p>
                  </td></tr>
                ) : agents.map(agent => (
                  <tr key={agent.id}>
                    <td className="agent-name">{agent.agent_name}</td>
                    <td>{agent.company_name}</td>
                    <td className="email-cell" title={agent.email}>
                      {agent.email.length > 22 ? agent.email.slice(0, 22) + '...' : agent.email}
                    </td>
                    <td>{agent.phone}</td>
                    <td className="center">{agent.properties}</td>
                    <td className="center">{agent.inspections}</td>
                    <td><StatusBadge status={agent.status} /></td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn view-btn" title="View" onClick={() => handleEditAgent(agent)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEditAgent(agent)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDeleteClick(agent)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                {pagination.page} of {pagination.total} rows selected
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn page-num ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >{p}</button>
                ))}
                {pagination.totalPages > 5 && <span className="page-ellipsis">···</span>}
                {pagination.totalPages > 5 && (
                  <button
                    className={`page-btn page-num ${pagination.page === pagination.totalPages ? 'active' : ''}`}
                    onClick={() => handlePageChange(pagination.totalPages)}
                  >{pagination.totalPages}</button>
                )}
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <AgentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        agent={editAgent}
        loading={modalLoading}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, agent: null })}
        onConfirm={handleDelete}
        agentName={deleteDialog.agent?.agent_name}
        loading={modalLoading}
      />
    </div>
  );
};

export default Agents;
