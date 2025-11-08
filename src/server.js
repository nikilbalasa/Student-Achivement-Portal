const app = require('./app');
const { connectToDatabase } = require('./utils/db');
const { ensureAdmin, ensureDefaultCategories } = require('./utils/seed');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectToDatabase();
  
  // Always ensure default categories exist
  await ensureDefaultCategories();
  
  if (process.env.AUTO_SEED_ADMIN === 'true') {
    await ensureAdmin({
      name: process.env.ADMIN_NAME || 'Administrator',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      department: process.env.ADMIN_DEPARTMENT || 'Administration',
    });
  }
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
    
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal startup error:', err);
  process.exit(1);
});


