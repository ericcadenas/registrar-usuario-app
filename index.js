const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const app = express();
const port = 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define a model for User
const User = sequelize.define('User', {
  userCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

// Sync the database
sequelize.sync();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create a new user
app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.redirect('/');
});

// Get all users or search by userCode
app.get('/users', async (req, res) => {
  const { userCode } = req.query;
  let users;
  if (userCode) {
    users = await User.findAll({ where: { userCode } });
  } else {
    users = await User.findAll();
  }
  res.json(users);
});

// Update a user
app.post('/users/update', async (req, res) => {
  const { userCode, ...updatedData } = req.body;
  await User.update(updatedData, { where: { userCode } });
  res.redirect('/');
});

// Delete a user
app.post('/users/delete', async (req, res) => {
  await User.destroy({ where: { userCode: req.body.userCode } });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Node.js app listening at http://localhost:${port}`);
});
