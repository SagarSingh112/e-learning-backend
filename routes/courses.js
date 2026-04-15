const express = require('express');
const mongoose = require('mongoose');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  duration: String,
  order: Number
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  price: Number,
  category: String,
  level: String,
  thumbnail: String,
  duration: String,
  modules: [moduleSchema],
  assignment: mongoose.Schema.Types.Mixed,
  rating: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    const sanitized = courses.map(c => ({
      ...c.toObject(),
      moduleCount: c.modules?.length || 0,
      modules: c.modules?.map(m => ({ id: m._id, title: m.title, duration: m.duration, order: m.order }))
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Create course
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, instructor, price, category, level, thumbnail, duration, modules, assignment } = req.body;
    if (!title || !description || !price) return res.status(400).json({ message: 'Required fields missing' });
    const course = await Course.create({ title, description, instructor, price: Number(price), category, level, thumbnail, duration, modules: modules || [], assignment: assignment || null });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update course
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete course
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await Enrollment.deleteMany({ courseId: req.params.id });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Add module
router.post('/:id/modules', adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.modules.push({ ...req.body, order: (course.modules.length || 0) + 1 });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Delete module
router.delete('/:id/modules/:moduleId', adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.modules = course.modules.filter(m => m._id.toString() !== req.params.moduleId);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = { router, Course };