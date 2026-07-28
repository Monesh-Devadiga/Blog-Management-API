require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const exportDir = path.join(__dirname, '..', 'database-export');

const models = {
  users: require('../src/models/User'),
  categories: require('../src/models/Category'),
  blogs: require('../src/models/Blog'),
};

async function exportDB() {
  try {
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const [name, Model] of Object.entries(models)) {
      const data = await Model.find().lean();
      const filePath = path.join(exportDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Exported ${data.length} ${name}`);
    }

    console.log(`\nDatabase exported to: ${exportDir}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Export failed:', error.message);
    process.exit(1);
  }
}

exportDB();
