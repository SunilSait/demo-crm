const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// All agent routes are protected
router.use(authMiddleware);

// GET /api/agents - List all agents with pagination, search, filter
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (search) {
    whereClause += ' AND (agent_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }

  try {
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM agents ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [agents] = await db.execute(
      `SELECT * FROM agents ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.status(200).json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/agents/:id - Get single agent
router.get('/:id', async (req, res) => {
  try {
    const [agents] = await db.execute('SELECT * FROM agents WHERE id = ?', [req.params.id]);
    if (agents.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }
    res.status(200).json({ success: true, data: agents[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/agents - Create agent
router.post('/', async (req, res) => {
  const { agent_name, company_name, email, phone, properties = 0, inspections = 0, status = 'Active' } = req.body;

  if (!agent_name || !company_name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, company, email, and phone are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM agents WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Agent with this email already exists.' });
    }

    const [result] = await db.execute(
      'INSERT INTO agents (agent_name, company_name, email, phone, properties, inspections, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [agent_name, company_name, email, phone, parseInt(properties), parseInt(inspections), status, req.user.id]
    );

    const [newAgent] = await db.execute('SELECT * FROM agents WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Agent created successfully.', data: newAgent[0] });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/agents/:id - Update agent
router.put('/:id', async (req, res) => {
  const { agent_name, company_name, email, phone, properties, inspections, status } = req.body;

  if (!agent_name || !company_name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, company, email, and phone are required.' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM agents WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    // Check email uniqueness (exclude current agent)
    const [emailCheck] = await db.execute(
      'SELECT id FROM agents WHERE email = ? AND id != ?',
      [email, req.params.id]
    );
    if (emailCheck.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already used by another agent.' });
    }

    await db.execute(
      'UPDATE agents SET agent_name=?, company_name=?, email=?, phone=?, properties=?, inspections=?, status=? WHERE id=?',
      [agent_name, company_name, email, phone, parseInt(properties) || 0, parseInt(inspections) || 0, status, req.params.id]
    );

    const [updated] = await db.execute('SELECT * FROM agents WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Agent updated successfully.', data: updated[0] });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT id FROM agents WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    await db.execute('DELETE FROM agents WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, message: 'Agent deleted successfully.' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
