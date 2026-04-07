const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Enroll in a course (initiate payment)
router.post('/', auth, (req, res) => {
  try {
    const { courseId, paymentMethod, paymentDetails } = req.body;
    const course = db.findById('courses', courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = db.findOne('enrollments', { userId: req.user.id, courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled in this course' });

    const enrollment = db.insert('enrollments', {
      id: uuidv4(),
      userId: req.user.id,
      courseId,
      courseName: course.title,
      amount: course.price,
      paymentMethod: paymentMethod || 'manual',
      paymentDetails: paymentDetails || {},
      paymentStatus: 'pending',
      status: 'pending_payment',
      completedModules: [],
      assignmentSubmitted: false,
      assignmentText: '',
      completed: false,
      enrolledAt: new Date().toISOString()
    });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my enrollments
router.get('/my', auth, (req, res) => {
  const enrollments = db.find('enrollments', { userId: req.user.id });
  const enriched = enrollments.map(e => {
    const course = db.findById('courses', e.courseId);
    return { ...e, course };
  });
  res.json(enriched);
});

// Get single enrollment
router.get('/:id', auth, (req, res) => {
  const enrollment = db.findById('enrollments', req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  if (enrollment.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const course = db.findById('courses', enrollment.courseId);
  res.json({ ...enrollment, course });
});

// Mark module complete
router.post('/:id/modules/:moduleId/complete', auth, (req, res) => {
  const enrollment = db.findById('enrollments', req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  if (enrollment.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  if (enrollment.paymentStatus !== 'approved') return res.status(400).json({ message: 'Payment not approved yet' });

  const course = db.findById('courses', enrollment.courseId);
  const completedModules = enrollment.completedModules || [];

  if (!completedModules.includes(req.params.moduleId)) {
    completedModules.push(req.params.moduleId);
  }

  const allModulesCompleted = course.modules && course.modules.length > 0 &&
    course.modules.every(m => completedModules.includes(m.id));

  const updates = { completedModules, updatedAt: new Date().toISOString() };
  if (allModulesCompleted && !enrollment.completed) {
    updates.allModulesCompleted = true;
  }

  const updated = db.update('enrollments', req.params.id, updates);
  const updatedCourse = db.findById('courses', enrollment.courseId);
  res.json({ ...updated, course: updatedCourse });
});

// Submit assignment
router.post('/:id/assignment', auth, (req, res) => {
  const enrollment = db.findById('enrollments', req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
  if (enrollment.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  if (!enrollment.allModulesCompleted) return res.status(400).json({ message: 'Complete all modules first' });

  const updated = db.update('enrollments', req.params.id, {
    assignmentSubmitted: true,
    assignmentText: req.body.assignmentText || '',
    assignmentFile: req.body.assignmentFile || '',
    assignmentSubmittedAt: new Date().toISOString(),
    completed: true,
    completedAt: new Date().toISOString()
  });

  const course = db.findById('courses', enrollment.courseId);
  res.json({ ...updated, course });
});

// Admin: Get all enrollments
router.get('/', adminAuth, (req, res) => {
  const enrollments = db.find('enrollments');
  const enriched = enrollments.map(e => {
    const user = db.findById('users', e.userId);
    const course = db.findById('courses', e.courseId);
    const { password, ...userSafe } = user || {};
    return { ...e, user: userSafe, course };
  });
  res.json(enriched);
});

// Admin: Approve/Reject payment
router.put('/:id/payment', adminAuth, (req, res) => {
  const enrollment = db.findById('enrollments', req.params.id);
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  const { status, note } = req.body; // 'approved' or 'rejected'
  const updates = {
    paymentStatus: status,
    paymentNote: note || '',
    status: status === 'approved' ? 'active' : 'payment_rejected',
    updatedAt: new Date().toISOString()
  };

  if (status === 'approved') {
    // Increment student count
    const course = db.findById('courses', enrollment.courseId);
    if (course) {
      db.update('courses', enrollment.courseId, { students: (course.students || 0) + 1 });
    }
  }

  const updated = db.update('enrollments', req.params.id, updates);
  res.json(updated);
});

module.exports = router;
