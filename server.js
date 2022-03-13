const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { join } = require('path');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const { profile } = require('console');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'akkhi',
      password : 'omaewamau',
      database : 'face recognition'
    }
  });

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfiles(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiReq(req, res) })

app.listen(8080, () => {
    console.log('app is running on port 8080')
})