const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: [
    'https://e-learning-frontend-1-jpnj.onrender.com', 
    'http://localhost:5173'
  ], 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'E-Learning API Running' }));

// Start server
async function startServer() {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    await seed();
    app.listen(PORT, () => {
      console.log(`\n🚀 E-Learning Server running on http://localhost:${PORT}`);
      console.log(`📚 API Endpoints:`);
      console.log(`   POST /api/auth/register - Register student`);
      console.log(`   POST /api/auth/login    - Login`);
      console.log(`   GET  /api/courses       - Get all courses`);
      console.log(`   POST /api/enrollments   - Enroll in course`);
      console.log(`\n🔑 Admin Login: admin@elearn.com / admin123\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();