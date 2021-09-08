const { MongoClient } = require('mongodb');
require('dotenv').config();
const { readFileSync } = require('fs');
const path = require('path');
const { ObjectID } = require('bson');

const uri = process.env.DATABASE;
const client = new MongoClient(uri);

async function insertUser(user) {
  try {
    await client.connect();

    const db = client.db('authDemo');
    const userCollection = db.collection('users');

    const result = await userCollection.insertOne(user);
    console.log(
      `User ${user.name} is is successfilly inserted with id: ${result.insertedId}`
    );
    console.log(result);
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
    console.log('operation successful');
    process.exit();
  }
}

async function insertPosts() {
  try {
    await client.connect();
    const db = client.db('authDemo');
    const postCollection = db.collection('posts');
    const posts = JSON.parse(
      readFileSync(path.join(__dirname, './data/posts.json'), 'utf8'),
      (key, value) => {
        if (key === 'author') {
          return ObjectID(value);
        } else {
          return value;
        }
      }
    );
    // console.log(posts);
    const result = await postCollection.insertMany(posts);
    console.log(`added posts to db`);
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
    console.log('Operation is completed');
    process.exit();
  }
}

async function insertSinglePost(post) {
  try {
    await client.connect();
    const db = client.db('authDemo');
    const postCollection = db.collection('posts');
    const result = await postCollection.insertOne(post);
    console.log(`added posts to db`);
  } catch (err) {
    console.dir(err);
  } finally {
    await client.close();
    console.log('Operation is completed');
    process.exit();
  }
}

const userDetails = {
  name: 'Sew',
  age: 25,
  hobby: 'create memes',
};

// working perfectly
const post = {
  title: 'single post 1',
  author: ObjectID('6134e8348da0b8d25d0cb452'),
};

// insertSinglePost(post);
insertPosts();

// insertUser(userDetails);
