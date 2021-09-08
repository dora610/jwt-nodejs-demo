const { readFile } = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('../models/Posts');
// const User = require('../models/Users');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
/* mongoose.connect(process.env.DATABASE, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Successfully connected to mongoDb');
  }
}); */
mongoose.connect(process.env.DATABASE);

function addPosts() {
  readFile(path.join(__dirname, '/posts1.json'), 'utf8', (err, posts) => {
    if (err) {
      console.log('File read error!!');
      console.error(err);
    } else {
      console.log('read start');
      console.log(JSON.parse(posts));
      Post.insertMany(JSON.parse(posts))
        .then((data) => {
          console.log(`Successfully added ${data.length} documents`);
          process.exit();
        })
        .catch((err) => {
          console.log('db presisitence error!!');
          console.error(err);
          process.exit();
        });
    }
  });
}

if (process.argv.includes('--add')) {
  addPosts();
}
