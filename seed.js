const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function seed() {
  const User = mongoose.models.User || require('./routes/auth').User;
  const { Course } = require('./routes/courses');

  const existingAdmin = await User.findOne({ email: 'admin@elearn.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@elearn.com', password: hashedPassword, role: 'admin' });
    console.log('Admin created: admin@elearn.com / admin123');
  }

  const existingCourses = await Course.countDocuments();
  if (existingCourses === 0) {
    await Course.create([
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, Node.js and more.',
        instructor: 'Dr. Sarah Johnson',
        price: 4999, category: 'Web Development', level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600',
        rating: 4.8, students: 12540, duration: '48 hours',
        modules: [
          { title: 'HTML Fundamentals', description: 'Learn the building blocks of web pages', videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', duration: '2h 30m', order: 1 },
          { title: 'CSS Styling & Layouts', description: 'Master styling with CSS', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc', duration: '3h 15m', order: 2 },
          { title: 'JavaScript Essentials', description: 'Core JavaScript concepts', videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg', duration: '4h 00m', order: 3 },
          { title: 'React Framework', description: 'Build dynamic UIs', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', duration: '5h 30m', order: 4 },
          { title: 'Node.js Backend', description: 'Server-side JavaScript', videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4', duration: '4h 45m', order: 5 }
        ]
      },
      {
        title: 'Python for Data Science & ML',
        description: 'Learn Python and apply it to data science and AI.',
        instructor: 'Prof. Michael Chen',
        price: 5999, category: 'Data Science', level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        rating: 4.9, students: 9870, duration: '60 hours',
        modules: [
          { title: 'Python Basics', description: 'Variables, loops, functions', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: '3h 00m', order: 1 },
          { title: 'NumPy & Pandas', description: 'Data manipulation', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '3h 30m', order: 2 },
          { title: 'Machine Learning', description: 'Scikit-Learn basics', videoUrl: 'https://www.youtube.com/embed/0Lt9w-BxKFQ', duration: '5h 00m', order: 3 }
        ]
      }
    ]);
    console.log('Courses seeded successfully');
  }

  console.log('Database seeded successfully!');
}

module.exports = seed;