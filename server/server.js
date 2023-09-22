const express = require('express');
const User = require('./schema/User');
const Post = require('./schema/Post');

const session = require('express-session');
const bcrypt = require('bcrypt');

const { usersDB, postsDB } = require('./dbConfig');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to Merngram!');
});

// API route to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to fetch all posts
app.get('/api/posts', requireAuth, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    res.cookie('connect.sid', req.sessionID, { httpOnly: true });
    req.session.user = newUser;
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log in the user
    req.session.user = user;
    res.cookie('connect.sid', req.sessionID, { httpOnly: true });
    res.status(200).json(user);
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

// Example usage:
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
