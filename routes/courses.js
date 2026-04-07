const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all courses (public)
router.get('/', (req, res) => {
  const courses = db.find('courses');
  const sanitized = courses.map(({ modules, assignment, ...c }) => ({
    ...c,
    moduleCount: modules?.length || 0,
    modules: modules?.map(m => ({ id: m.id, title: m.title, duration: m.duration, order: m.order }))
  }));
  res.json(sanitized);
});

// Get single course
router.get('/:id', (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// Admin: Create course
router.post('/', adminAuth, (req, res) => {
  try {
    const { title, description, instructor, price, category, level, thumbnail, duration, modules, assignment } = req.body;
    if (!title || !description || !price) return res.status(400).json({ message: 'Required fields missing' });

    const course = db.insert('courses', {
      id: uuidv4(),
      title, description, instructor, price: Number(price), category,
      level, thumbnail, duration,
      modules: modules || [],
      assignment: assignment || null,
      rating: 0, students: 0,
      createdAt: new Date().toISOString()
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: Update course
router.put('/:id', adminAuth, (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const updated = db.update('courses', req.params.id, { ...req.body, updatedAt: new Date().toISOString() });
  res.json(updated);
});

// Admin: Delete course
router.delete('/:id', adminAuth, (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  db.delete('courses', req.params.id);
  db.deleteMany('enrollments', { courseId: req.params.id });
  res.json({ message: 'Course deleted' });
});

// Admin: Add module to course
router.post('/:id/modules', adminAuth, (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const module = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    duration: req.body.duration,
    order: (course.modules?.length || 0) + 1
  };

  const modules = [...(course.modules || []), module];
  const updated = db.update('courses', req.params.id, { modules });
  res.json(updated);
});

// Admin: Delete module
router.delete('/:id/modules/:moduleId', adminAuth, (req, res) => {
  const course = db.findById('courses', req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const modules = (course.modules || []).filter(m => m.id !== req.params.moduleId);
  const updated = db.update('courses', req.params.id, { modules });
  res.json(updated);
});

module.exports = router;
