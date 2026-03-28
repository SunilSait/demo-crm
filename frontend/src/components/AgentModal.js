import React, { useState, useEffect } from 'react';

const INITIAL_FORM = {
  agent_name: '', company_name: '', email: '', phone: '',
  properties: '', inspections: '', status: 'Active'
};

const AgentModal = ({ isOpen, onClose, onSubmit, agent, loading }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent) {
      setForm({
        agent_name: agent.agent_name || '',
        company_name: agent.company_name || '',
        email: agent.email || '',
        phone: agent.phone || '',
        properties: agent.properties ?? '',
        inspections: agent.inspections ?? '',
        status: agent.status || 'Active'
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [agent, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.agent_name.trim()) errs.agent_name = 'Agent name is required.';
    if (!form.company_name.trim()) errs.company_name = 'Company name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.phone.trim()) errs.phone = 'Phone is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{agent ? 'Edit Agent' : 'Add New Agent'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Agent Name *</label>
              <input name="agent_name" value={form.agent_name} onChange={handleChange} placeholder="Full name" />
              {errors.agent_name && <span className="field-error">{errors.agent_name}</span>}
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company" />
              {errors.company_name && <span className="field-error">{errors.company_name}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@company.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+44 7000 000000" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Properties</label>
              <input name="properties" type="number" value={form.properties} onChange={handleChange} placeholder="0" min="0" />
            </div>
            <div className="form-group">
              <label>Inspections</label>
              <input name="inspections" type="number" value={form.inspections} onChange={handleChange} placeholder="0" min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (agent ? 'Update Agent' : 'Add Agent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentModal;
