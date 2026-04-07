// seed.js - Initialize database with sample data
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

async function seed() {
  // Create admin user
  const existingAdmin = db.findOne('users', { email: 'admin@elearn.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.insert('users', {
      id: uuidv4(),
      name: 'Admin',
      email: 'admin@elearn.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('Admin created: admin@elearn.com / admin123');
  }

  // Create sample courses
  const existingCourses = db.find('courses');
  if (existingCourses.length === 0) {
    const courses = [
      {
        id: uuidv4(),
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects and become a full-stack developer.',
        instructor: 'Dr. Sarah Johnson',
        price: 4999,
        category: 'Web Development',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600',
        rating: 4.8,
        students: 12540,
        duration: '48 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'HTML Fundamentals',
            description: 'Learn the building blocks of web pages',
            videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
            duration: '2h 30m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'CSS Styling & Layouts',
            description: 'Master styling with CSS and Flexbox/Grid',
            videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc',
            duration: '3h 15m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'JavaScript Essentials',
            description: 'Core JavaScript concepts and DOM manipulation',
            videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg',
            duration: '4h 00m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'React Framework',
            description: 'Build dynamic UIs with React',
            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
            duration: '5h 30m',
            order: 4
          },
          {
            id: uuidv4(),
            title: 'Node.js Backend',
            description: 'Server-side JavaScript with Node.js',
            videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
            duration: '4h 45m',
            order: 5
          }
        ],
        assignment: {
          title: 'Build a Full-Stack Web Application',
          description: 'Create a complete web application using the skills learned in this course. Your app should include a frontend built with React and a backend API with Node.js. Submit your GitHub repository link.',
          dueInDays: 7
        },
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Python for Data Science & ML',
        description: 'Learn Python programming and apply it to data science, machine learning, and AI. Includes pandas, numpy, scikit-learn, and TensorFlow.',
        instructor: 'Prof. Michael Chen',
        price: 5999,
        category: 'Data Science',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
        rating: 4.9,
        students: 9870,
        duration: '60 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'Python Programming Basics',
            description: 'Variables, loops, functions and OOP',
            videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
            duration: '3h 00m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'NumPy & Pandas',
            description: 'Data manipulation and analysis',
            videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
            duration: '3h 30m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'Data Visualization',
            description: 'Matplotlib, Seaborn and Plotly',
            videoUrl: 'https://www.youtube.com/embed/a9UrKTVEeZA',
            duration: '2h 45m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'Machine Learning with Scikit-Learn',
            description: 'Classification, regression and clustering',
            videoUrl: 'https://www.youtube.com/embed/0Lt9w-BxKFQ',
            duration: '5h 00m',
            order: 4
          },
          {
            id: uuidv4(),
            title: 'Deep Learning & Neural Networks',
            description: 'TensorFlow and Keras fundamentals',
            videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
            duration: '4h 30m',
            order: 5
          }
        ],
        assignment: {
          title: 'ML Model Project',
          description: 'Build a machine learning model that solves a real-world problem. Document your process, from data collection to model evaluation. Submit a Jupyter Notebook.',
          dueInDays: 10
        },
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'UI/UX Design Masterclass',
        description: 'Learn professional UI/UX design from scratch. Master Figma, design principles, user research, wireframing, and prototyping.',
        instructor: 'Emma Rodriguez',
        price: 3499,
        category: 'Design',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        rating: 4.7,
        students: 7230,
        duration: '36 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'Design Principles & Theory',
            description: 'Color, typography and visual hierarchy',
            videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
            duration: '2h 30m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'Figma Essentials',
            description: 'Master the leading design tool',
            videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
            duration: '3h 00m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'User Research Methods',
            description: 'Interviews, surveys and usability testing',
            videoUrl: 'https://www.youtube.com/embed/X0Yl7aHEJmE',
            duration: '2h 15m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'Wireframing & Prototyping',
            description: 'From sketches to interactive prototypes',
            videoUrl: 'https://www.youtube.com/embed/ykn4XNDwW7Q',
            duration: '3h 30m',
            order: 4
          }
        ],
        assignment: {
          title: 'Design a Mobile App UI',
          description: 'Design a complete mobile app of your choice from user research to high-fidelity prototype. Present your design decisions and share the Figma link.',
          dueInDays: 14
        },
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Digital Marketing & SEO',
        description: 'Master digital marketing strategies including SEO, social media marketing, Google Ads, content marketing, and email campaigns.',
        instructor: 'James Wilson',
        price: 2999,
        category: 'Marketing',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        rating: 4.6,
        students: 15300,
        duration: '30 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'SEO Fundamentals',
            description: 'On-page and off-page SEO strategies',
            videoUrl: 'https://www.youtube.com/embed/DvwS7cV9GmQ',
            duration: '2h 30m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'Social Media Marketing',
            description: 'Build and grow on major platforms',
            videoUrl: 'https://www.youtube.com/embed/qWkRtfAm_Bg',
            duration: '2h 45m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'Google Ads & PPC',
            description: 'Run profitable paid campaigns',
            videoUrl: 'https://www.youtube.com/embed/8ZQOZ_PbBaI',
            duration: '3h 00m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'Email Marketing',
            description: 'Build lists and create campaigns',
            videoUrl: 'https://www.youtube.com/embed/q6e0Op6X4kk',
            duration: '2h 00m',
            order: 4
          }
        ],
        assignment: {
          title: 'Create a Digital Marketing Campaign',
          description: 'Plan and present a complete digital marketing campaign for a business of your choice. Include SEO strategy, social media plan, and ad budget allocation.',
          dueInDays: 7
        },
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, APIs, and deployment.',
        instructor: 'Priya Sharma',
        price: 4499,
        category: 'Mobile Development',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
        rating: 4.8,
        students: 5640,
        duration: '42 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'React Native Setup & Basics',
            description: 'Environment setup and core components',
            videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc',
            duration: '3h 00m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'Navigation & Routing',
            description: 'Stack, tab and drawer navigation',
            videoUrl: 'https://www.youtube.com/embed/Hhh4bNPCGMQ',
            duration: '2h 30m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'State Management with Redux',
            description: 'Managing complex application state',
            videoUrl: 'https://www.youtube.com/embed/CVpUuw9XSjY',
            duration: '3h 30m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'API Integration & Async',
            description: 'REST APIs, fetch and async operations',
            videoUrl: 'https://www.youtube.com/embed/gp5H0Vw39yw',
            duration: '2h 45m',
            order: 4
          },
          {
            id: uuidv4(),
            title: 'Deployment & Publishing',
            description: 'Deploy to App Store and Google Play',
            videoUrl: 'https://www.youtube.com/embed/oBWBDaqpnlM',
            duration: '2h 00m',
            order: 5
          }
        ],
        assignment: {
          title: 'Build a Cross-Platform Mobile App',
          description: 'Create a functional mobile application using React Native. The app must work on both iOS and Android. Include at least 3 screens and API integration.',
          dueInDays: 14
        },
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Cybersecurity & Ethical Hacking',
        description: 'Learn cybersecurity fundamentals, penetration testing, network security, and ethical hacking techniques used by security professionals.',
        instructor: 'Alex Thompson',
        price: 6499,
        category: 'Cybersecurity',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
        rating: 4.9,
        students: 4120,
        duration: '55 hours',
        modules: [
          {
            id: uuidv4(),
            title: 'Networking Fundamentals',
            description: 'TCP/IP, protocols and network architecture',
            videoUrl: 'https://www.youtube.com/embed/qiQR5rTSshw',
            duration: '3h 30m',
            order: 1
          },
          {
            id: uuidv4(),
            title: 'Linux for Security',
            description: 'Command line and security tools',
            videoUrl: 'https://www.youtube.com/embed/ZtqBQ68cfJc',
            duration: '4h 00m',
            order: 2
          },
          {
            id: uuidv4(),
            title: 'Penetration Testing',
            description: 'Ethical hacking methodologies',
            videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
            duration: '5h 00m',
            order: 3
          },
          {
            id: uuidv4(),
            title: 'Web Application Security',
            description: 'OWASP Top 10 and vulnerability testing',
            videoUrl: 'https://www.youtube.com/embed/WjMvd55myHE',
            duration: '4h 30m',
            order: 4
          },
          {
            id: uuidv4(),
            title: 'Cryptography & Defense',
            description: 'Encryption, firewalls and IDS/IPS',
            videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc',
            duration: '3h 45m',
            order: 5
          }
        ],
        assignment: {
          title: 'Security Audit Report',
          description: 'Perform a security audit on a test environment provided. Document all vulnerabilities found, their severity, and recommended fixes. Submit a professional security report.',
          dueInDays: 10
        },
        createdAt: new Date().toISOString()
      }
    ];

    courses.forEach(course => db.insert('courses', course));
    console.log(`${courses.length} courses seeded successfully`);
  }

  console.log('Database seeded successfully!');
}

module.exports = seed;
