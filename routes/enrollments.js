const express = require('express');
const mongoose = require('mongoose');
const { auth, adminAuth } = require('../middleware/auth');
const { Course } = require('./courses');

const router = express.Router();

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  courseName: String,
  amount: Number,
  paymentMethod: { type: String, default: 'manual' },
  paymentDetails: mongoose.Schema.Types.Mixed,
  paymentStatus: { type: String, default: 'pending' },
  paymentNote: String,
  status: { type: String, default: 'pending_payment' },
  completedModules: [String],
  allModulesCompleted: { type: Boolean, default: false },
  assignmentSubmitted: { type: Boolean, default: false },
  assignmentText: String,
  assignmentFile: String,
  assignmentSubmittedAt: Date,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  enrolledAt: { type: Date, default: Date.now }
});

const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

// Enroll in course
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, paymentMethod, paymentDetails } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled in this course' });

    const enrollment = await Enrollment.create({
      userId: req.user.id, courseId,
      courseName: course.title,
      amount: course.price,
      paymentMethod: paymentMethod || 'manual',
      paymentDetails: paymentDetails || {}
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my enrollments
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single enrollment
router.get('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('courseId');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.userId.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Mark module complete
router.post('/:id/modules/:moduleId/complete', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (enrollment.paymentStatus !== 'approved') return res.status(400).json({ message: 'Payment not approved yet' });

    const course = await Course.findById(enrollment.courseId);
    if (!enrollment.completedModules.includes(req.params.moduleId))
      enrollment.completedModules.push(req.params.moduleId);

    const allDone = course.modules.every(m => enrollment.completedModules.includes(m._id.toString()));
    if (allDone) enrollment.allModulesCompleted = true;

    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit assignment
router.post('/:id/assignment', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    if (enrollment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (!enrollment.allModulesCompleted) return res.status(400).json({ message: 'Complete all modules first' });

    enrollment.assignmentSubmitted = true;
    enrollment.assignmentText = req.body.assignmentText || '';
    enrollment.assignmentFile = req.body.assignmentFile || '';
    enrollment.assignmentSubmittedAt = new Date();
    enrollment.completed = true;
    enrollment.completedAt = new Date();
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Get all enrollments
router.get('/', adminAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('userId', '-password').populate('courseId');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Approve/Reject payment
router.put('/:id/payment', adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    enrollment.paymentStatus = status;
    enrollment.paymentNote = note || '';
    enrollment.status = status === 'approved' ? 'active' : 'payment_rejected';

    if (status === 'approved') {
      await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { students: 1 } });
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;