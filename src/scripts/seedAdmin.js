/* eslint-disable no-console */
require('dotenv').config();
const { connectToDatabase } = require('../utils/db');
const { ensureAdmin } = require('../utils/seed');

async function run() {
  await connectToDatabase();

  const name = process.env.ADMIN_NAME || 'Administrator';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const department = process.env.ADMIN_DEPARTMENT || 'Administration';

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await ensureAdmin({ name, email, password, department });
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


