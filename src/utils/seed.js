/* eslint-disable no-console */
const User = require('../models/User');
const Category = require('../models/Category');

async function ensureAdmin({ name, email, password, department }) {
  if (!email || !password) {
    console.warn('Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD missing');
    return { created: false, reason: 'missing-env' };
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`User updated to admin: ${email}`);
      return { created: false, updated: true };
    }
    console.log(`Admin already exists: ${email}`);
    return { created: false, updated: false };
  }

  const admin = await User.create({ name, email, password, role: 'admin', department });
  console.log('Admin created:', { id: admin._id.toString(), email: admin.email });
  return { created: true };
}

async function ensureDefaultCategories() {
  const defaultCategories = [
    { name: 'Academic Excellence', description: 'Academic achievements, scholarships, research papers', type: 'academic' },
    { name: 'Sports & Athletics', description: 'Sports competitions, tournaments, athletic achievements', type: 'sports' },
    { name: 'Technical Skills', description: 'Hackathons, coding competitions, technical certifications', type: 'technical' },
    { name: 'Cultural Activities', description: 'Cultural events, arts, music, drama competitions', type: 'cultural' },
    { name: 'Leadership & Service', description: 'Student council, community service, volunteering', type: 'other' },
    { name: 'Innovation & Entrepreneurship', description: 'Startups, innovation challenges, business competitions', type: 'technical' },
    { name: 'Publications', description: 'Research publications, articles, papers', type: 'academic' },
    { name: 'Other Achievements', description: 'Other notable achievements and recognitions', type: 'other' },
  ];

  let createdCount = 0;
  for (const cat of defaultCategories) {
    const existing = await Category.findOne({ name: cat.name });
    if (!existing) {
      await Category.create(cat);
      createdCount++;
    }
  }

  if (createdCount > 0) {
    console.log(`Created ${createdCount} default categories`);
  } else {
    console.log('Default categories already exist');
  }

  return { created: createdCount };
}

module.exports = { ensureAdmin, ensureDefaultCategories };


