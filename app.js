const express = require('express');
const routes = require('./router/index');
const authRoutes = require('./router/authRouter');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.DATABASE;
mongoose
  .connect(uri)
  .then(() => {
    console.log('Successfully connected to mongoDb');
    app.listen(port);
  })
  .then(() => console.log(`Server is running at http://localhost:${port}`))
  .catch((err) => console.error(err));

app.use(express.json());

app.use('/', routes);
app.use('/user/', authRoutes);
