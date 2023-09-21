const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const dbURLUsers = process.env.DB_URL_USERS;
const dbURLPosts = process.env.DB_URL_POSTS;
const usernameForUsersDb = process.env.DB_USERNAME_USERS;
const passwordForUsersDb = process.env.DB_PASSWORD_USERS;
const usernameForPostsDb = process.env.DB_USERNAME_POSTS;
const passwordForPostsDb = process.env.DB_PASSWORD_POSTS;

const usersDB = mongoose.connect(dbURLUsers, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: usernameForUsersDb,
  pass: passwordForUsersDb,
});

const postsDB = mongoose.createConnection(dbURLPosts, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: usernameForPostsDb,
  pass: passwordForPostsDb,
});

module.exports = { usersDB: mongoose, postsDB: mongoose };
