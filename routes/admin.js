const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
router.get('/stats', adminAuth, (req, res) => {
  const users = db.find('users', { role: 'student' });
  const courses = db.find('courses');
  const enrollments = db.find('enrollments');
  const pending = enrollments.filter(e => e.paymentStatus === 'pending');
  const approved = enrollments.filter(e => e.paymentStatus === 'approved');
  const completed = enrollments.filter(e => e.completed);
  const revenue = approved.reduce((sum, e) => sum + (e.amount || 0), 0);

  res.json({
    totalStudents: users.length,
    totalCourses: courses.length,
    totalEnrollments: enrollments.length,
    pendingPayments: pending.length,
    approvedEnrollments: approved.length,
    completedCourses: completed.length,
    totalRevenue: revenue
  });
});

// Get all users
router.get('/users', adminAuth, (req, res) => {
  const users = db.find('users');
  const safe = users.map(({ password, ...u }) => u);
  res.json(safe);
});

// Delete user
router.delete('/users/:id', adminAuth, (req, res) => {
  db.delete('users', req.params.id);
  db.deleteMany('enrollments', { userId: req.params.id });
  res.json({ message: 'User deleted' });
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  const user = db.findById('users', req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const updates = { ...req.body };
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  delete updates.id;

  const updated = db.update('users', req.params.id, updates);
  const { password, ...safe } = updated;
  res.json(safe);
});

module.exports = router;
