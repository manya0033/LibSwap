const bcrypt = require('bcryptjs');
const User = require('../model/User');

// Register a new student
const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // Check required fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({
        message: 'Username, full name, email and password are required'
      });
    }

    // Basic password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: normalizedEmail }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username: username.trim(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'student'
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Username or email already exists'
      });
    }

    return res.status(500).json({
      message: 'Server error during registration'
    });
  }
};

module.exports = {
  register
};