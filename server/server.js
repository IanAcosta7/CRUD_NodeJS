require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());
 
// Public Folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes
app.use(require('./routes'));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log('Database Online...');
  }
});

app.listen(process.env.PORT, () => {
    console.log(`Running on port: ${process.env.PORT}`);
});