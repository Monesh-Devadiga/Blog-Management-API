require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Blog = require('../src/models/Blog');

const seedData = {
  categories: [
    { name: 'Technology', description: 'Posts about technology and software development' },
    { name: 'Travel', description: 'Travel guides, tips, and experiences' },
    { name: 'Food', description: 'Recipes, reviews, and food culture' },
    { name: 'Health', description: 'Health tips, fitness, and wellness' },
    { name: 'Business', description: 'Business strategies, entrepreneurship, and finance' },
  ],
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: seedData.user.email });
    if (!existingAdmin) {
      await User.create(seedData.user);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      const cats = await Category.insertMany(seedData.categories);
      console.log(`Created ${cats.length} categories`);

      const admin = await User.findOne({ email: seedData.user.email });
      const sampleBlogs = [
        { title: 'Getting Started with Node.js', content: 'Node.js is a JavaScript runtime built on Chrome V8 engine...', category: cats[0]._id, author: admin._id, status: 'published', tags: ['nodejs', 'javascript'], excerpt: 'A beginner guide to Node.js' },
        { title: 'Top 10 Travel Destinations 2025', content: 'Explore the most amazing travel destinations...', category: cats[1]._id, author: admin._id, status: 'published', tags: ['travel', 'destinations'], excerpt: 'Best places to visit in 2025' },
        { title: 'Healthy Eating Habits', content: 'Learn about maintaining a balanced diet...', category: cats[3]._id, author: admin._id, status: 'published', tags: ['health', 'nutrition'], excerpt: 'Tips for healthy eating' },
        { title: 'Understanding REST APIs', content: 'REST APIs are the backbone of modern web applications...', category: cats[0]._id, author: admin._id, status: 'draft', tags: ['api', 'rest', 'backend'], excerpt: 'Deep dive into REST API design' },
        { title: 'Starting a Small Business', content: 'Key steps to launch your own business...', category: cats[4]._id, author: admin._id, status: 'published', tags: ['business', 'entrepreneurship'], excerpt: 'Business startup guide' },
      ];
      await Blog.insertMany(sampleBlogs);
      console.log(`Created ${sampleBlogs.length} sample blogs`);
    } else {
      console.log('Categories already seeded');
    }

    console.log('\nSeed completed!');
    console.log('Login credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
