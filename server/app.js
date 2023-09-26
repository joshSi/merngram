const dotenv = require('dotenv').config()
const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Import & use routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Merngram!');
});

// 404 route
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
