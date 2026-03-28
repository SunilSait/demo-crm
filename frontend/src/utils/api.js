import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// ── Mock data store (used when backend is unreachable) ──
let mockAgents = [
  { id: 1, agent_name: 'Michael', company_name: 'Bluenest reality', email: 'michael@bluenest.com', phone: '+44 7911 234567', properties: 18, inspections: 42, status: 'Active' },
  { id: 2, agent_name: 'Olivia Harris', company_name: 'Urbankey estates', email: 'olivia@urbankey.com', phone: '+44 8911 234567', properties: 2, inspections: 10, status: 'Active' },
  { id: 3, agent_name: 'Daniel', company_name: 'Bluenest reality', email: 'daniel@primelet.com', phone: '+44 7822 456789', properties: 18, inspections: 20, status: 'Inactive' },
  { id: 4, agent_name: 'Wilson', company_name: 'City homes', email: 'wilson@cityhomes.com', phone: '+44 7822 456789', properties: 10, inspections: 10, status: 'Active' },
  { id: 5, agent_name: 'Sophie', company_name: 'City homes', email: 'sophie@cityhomes.com', phone: '+44 7700 112233', properties: 12, inspections: 10, status: 'Suspended' },
  { id: 6, agent_name: 'Turner Bruno', company_name: 'Primelet agents', email: 'turner@horizon.com', phone: '+44 7555 998877', properties: 20, inspections: 20, status: 'Active' },
  { id: 7, agent_name: 'Bucky', company_name: 'Bluenest reality', email: 'bucky@bluenest.com', phone: '+44 7911 234567', properties: 18, inspections: 42, status: 'Active' },
  { id: 8, agent_name: 'William Butcher', company_name: 'Urbankey estates', email: 'william@urbankey.com', phone: '+44 8911 234567', properties: 18, inspections: 10, status: 'Inactive' },
  { id: 9, agent_name: 'John', company_name: 'Bluenest reality', email: 'john@bluenest.com', phone: '+44 7822 456789', properties: 18, inspections: 20, status: 'Active' },
  { id: 10, agent_name: 'Carter', company_name: 'Primelet agents', email: 'carter@primelet.com', phone: '+44 7822 456789', properties: 18, inspections: 10, status: 'Suspended' },
  { id: 11, agent_name: 'Willy', company_name: 'Urbankey estates', email: 'willy@urbankey.com', phone: '+44 7700 112233', properties: 18, inspections: 10, status: 'Inactive' },
  { id: 12, agent_name: 'Mike', company_name: 'Primelet agents', email: 'mike@primelet.com', phone: '+44 7555 998877', properties: 18, inspections: 20, status: 'Active' },
];
let nextId = 13;

const mockDelay = (ms = 300) => new Promise(res => setTimeout(res, ms));

const mockAPI = {
  getAll: async ({ page = 1, limit = 12, search = '', status = '' } = {}) => {
    await mockDelay();
    let filtered = [...mockAgents];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.agent_name.toLowerCase().includes(q) ||
        a.company_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    if (status) filtered = filtered.filter(a => a.status === status);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + Number(limit));
    return { data: { success: true, data, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) } } };
  },
  getById: async (id) => {
    await mockDelay();
    const agent = mockAgents.find(a => a.id === Number(id));
    if (!agent) throw new Error('Agent not found');
    return { data: { success: true, data: agent } };
  },
  create: async (formData) => {
    await mockDelay();
    if (mockAgents.find(a => a.email === formData.email)) {
      const err = new Error('Email already exists'); err.response = { data: { message: 'Agent with this email already exists.' } }; throw err;
    }
    const agent = { ...formData, id: nextId++, properties: Number(formData.properties) || 0, inspections: Number(formData.inspections) || 0 };
    mockAgents.unshift(agent);
    return { data: { success: true, data: agent, message: 'Agent created successfully.' } };
  },
  update: async (id, formData) => {
    await mockDelay();
    const idx = mockAgents.findIndex(a => a.id === Number(id));
    if (idx === -1) { const err = new Error('Not found'); err.response = { data: { message: 'Agent not found.' } }; throw err; }
    if (mockAgents.find(a => a.email === formData.email && a.id !== Number(id))) {
      const err = new Error('Email used'); err.response = { data: { message: 'Email already used by another agent.' } }; throw err;
    }
    mockAgents[idx] = { ...mockAgents[idx], ...formData, id: Number(id), properties: Number(formData.properties) || 0, inspections: Number(formData.inspections) || 0 };
    return { data: { success: true, data: mockAgents[idx], message: 'Agent updated successfully.' } };
  },
  delete: async (id) => {
    await mockDelay();
    const idx = mockAgents.findIndex(a => a.id === Number(id));
    if (idx === -1) { const err = new Error('Not found'); err.response = { data: { message: 'Agent not found.' } }; throw err; }
    mockAgents.splice(idx, 1);
    return { data: { success: true, message: 'Agent deleted successfully.' } };
  }
};

// ── Try real backend, fall back to mock ──
const tryReal = async (realFn, mockFn) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return await realFn();
  } catch (err) {
    // If network error or 401/404 from missing backend, use mock
    const isNetworkErr = !err.response;
    const isServerMissing = err.response?.status >= 500 || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';
    if (isNetworkErr || isServerMissing) {
      console.warn('[API] Backend unreachable — using mock data');
      return await mockFn();
    }
    throw err;
  }
};

export const agentsAPI = {
  getAll:   (p)     => tryReal(() => axios.get(`${API_BASE}/agents`, { params: p }),    () => mockAPI.getAll(p)),
  getById:  (id)    => tryReal(() => axios.get(`${API_BASE}/agents/${id}`),              () => mockAPI.getById(id)),
  create:   (data)  => tryReal(() => axios.post(`${API_BASE}/agents`, data),             () => mockAPI.create(data)),
  update:   (id, d) => tryReal(() => axios.put(`${API_BASE}/agents/${id}`, d),           () => mockAPI.update(id, d)),
  delete:   (id)    => tryReal(() => axios.delete(`${API_BASE}/agents/${id}`),           () => mockAPI.delete(id)),
};
