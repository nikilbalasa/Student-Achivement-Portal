/* eslint-disable no-console */
require('dotenv').config();
const { connectToDatabase } = require('../utils/db');
const { ensureDefaultCategories } = require('../utils/seed');

async function run() {
  try {
    await connectToDatabase();
    const result = await ensureDefaultCategories();
    console.log(`\n✅ Category seeding completed!`);
    console.log(`Created ${result.created} new categories\n`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding categories:', err);
    process.exit(1);
  }
}

run();

