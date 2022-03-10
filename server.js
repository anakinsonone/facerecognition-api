const express = require('express');
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { join } = require('path');

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

// db.select('*').from('users').then(data => {
//     console.log(data);
// })
const app = express();
app.use(express.json());
app.use(cors());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: "john",
//             email: "john@gmail.com",
//             password: "cookies",
//             entries: 0,
//             joining: new Date()
//         },
//         {
//             id: '124',
//             name: "sally",
//             email: "sally@gmail.com",
//             password: "bananas",
//             entries: 0,
//             joining: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }
// console.log(database.users[2])
app.get('/', (req, res) => {    
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email == database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else (res.status(400).json('error logging in'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json("unable to register"))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            console.log(user);
            if(user.length) {
                res.json(user);
            }   else (
                res.status(400).json("User not found")
            )
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json("unable to get entries"))
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(8080, () => {
    console.log('app is running on port 8080')
})