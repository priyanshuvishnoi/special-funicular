if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(_ => console.log('Connected to DB'))
  .catch(err => console.error(err));

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname))

app.use('/api/users/', usersRouter);

app.use('/*', express.static(path.join(__dirname, 'public')));
module.exports = app;
