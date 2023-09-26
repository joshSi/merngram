const express = require('express');
const router = express.Router();
const Post = require('../schema/Post');

// API route to fetch all posts
router.get('/', requireAuth, async (req, res) => {
  try {
    // Your code to fetch all posts here
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

module.exports = router;
