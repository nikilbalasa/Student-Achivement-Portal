const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  const payload = { id: user._id.toString(), role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  return token;
}

async function register(req, res, next) {
  try {
    const { name, email, password, department, enrollmentNumber, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, department, enrollmentNumber, role: role || 'student' });
    const token = signToken(user);
    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department };
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Faculty security: Check if faculty email is whitelisted
    if (user.role === 'faculty') {
      const allowedFacultyEmails = process.env.ALLOWED_FACULTY_EMAILS 
        ? process.env.ALLOWED_FACULTY_EMAILS.split(',').map(e => e.trim().toLowerCase())
        : [];
      
      if (allowedFacultyEmails.length > 0 && !allowedFacultyEmails.includes(email.toLowerCase())) {
        return res.status(403).json({ message: 'Faculty access restricted. Contact administrator.' });
      }
    }
    
    const token = signToken(user);
    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department };
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };


