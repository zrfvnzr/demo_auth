const bcrypt = require('bcrypt')
const passport = require('passport')
const database = require('./database/database')
const express = require('express');
const LocalStrategy = require('passport-local')
const router = express.Router();
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const { v4: uuidv4 } = require('uuid');

async function main(app) {
  return new Promise(async (resolve, reject) => {
    try {
      app.use(session({
        secret: 'zrfvnzr',
        resave: false,
        saveUninitialized: false,
        store: new SQLiteStore({ db: 'session.db', dir: './database' })
      }))
      app.use(passport.initialize())
      app.use(passport.session())
      resolve()
    } catch (error) {
      console.log('Error on auth.js > main')
      console.log(error)
      reject()
    }
  })
}

async function configureLocalStrategy(db) {
  return new Promise(async (resolve, reject) => {
    try {
    // Local Strategy Configuration
    passport.use(new LocalStrategy(async function verify(username, password, done) {
      try {
        const getUser = 'SELECT * FROM user WHERE username = ?'
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        const result = await database.get(db, getUser, [username], true)
        if (!result) {
          return done(null, false)
        }
        if (await bcrypt.compare(password, result.password)) {
          // Success
          return done(null, result)
        } else {
          console.log('LocalStrategy > verify > password does not match hashedPassword')
          return done(null, false)
        }
      } catch(err) {
        console.log('Error on LocalStrategy > verify')
        console.log(err)
        return done(null, false)
      }
    }
    ))

    passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      // console.log('serializingUser > user is', user) // temp
      cb(null, user)
    })
    })

    passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      // console.log('deserializeUser > user is', user) // temp
      return cb(null, user);
    })
    })

    // end LocalStrategy Configuration
    resolve()     
    } catch (error) {
      console.log('Error on auth.js > configureLocalStrategy') // temp
      console.log(error) // temp
      reject()
    }
  })
}

// Routes

  // get all users
  router.post('/api/getAllUsers', adminOnly, async (req, res) => {
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const rows = await database.all(db, `
        SELECT role, username FROM user ORDER BY role ASC
      `, [], false)
      res.send(rows)
    } catch (error) {
      console.log('Error on /api/getAllUsers') // temp
      console.log(error) // temp
      res.json({message: error}).send()
    }
  })
  // end get all users

  // authorize
  router.post('/api/authorize', (req, res) => {
    if (req.user) {
      res.json({username: req.user.username, role: req.user.role}).send()
    } else {
      res.status(401).json({message: 'User not logged in'}).send()
    }
  })
  // end authorize

  // register
  router.post('/api/register', adminOnly, async (req, res) => {
    // check if username already exists
    try {
      const source = './database/db.sqlite'
      const db = await database.openOrCreateDB(source)
      const row = await database.get(db, `SELECT * FROM user WHERE username = ?`, [req.body.username])
      if (row) {
        // username already exists
        res.status(401).json({message: 'User already exists'}).send()
      } else {
        // insert new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const row = await database.run(db, `INSERT INTO user (id, role, username, password) VALUES (?, ?, ?, ?)`, [uuidv4(), req.body.role, req.body.username, hashedPassword])
        res.json({message: `Register success for user ${req.body.username}`}).send()
      }
    } catch (error) {
      res.status(401).json({message: error}).send()
    }
  })
  // end register

  // login
  router.post('/api/login', (req, res) => {
    passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            console.log('Error on req.logIn') // temp
            console.log(err)
            res.status(401).json({messsage: 'Login error', redirect: '/login?error=1'}).send()
          } else {
            res.json({messsage: 'Login success', role: user.role}).send()
          }
        })
      } else {
        res.status(401).json({messsage: 'Login error', redirect: '/login?error=1'}).send()
      }
    })(req, res)
  })
  // end login  

  // logout
  router.post('/api/logout', function(req, res) {
    try {
      req.logout(function(err) {
        if (err) { res.json({redirect: '/toLoggedOut'}).send() }
        res.json({redirect: '/toLoggedOut'}).send()
      })
    } catch (error) {
      res.json({message: error}).send()
    }
  })
  // end logout

  // logout redirect
  router.get('/toLoggedOut', (req, res) => {
    res.redirect('/login?loggedOut=1')
  })
  // end logout redirect

  // edit user
  router.post('/api/editUser', adminOnly, async (req, res) => {
    try {
      if (!req.body.new_role || !req.body.old_username || !req.body.new_username || !req.body.new_password) {
        throw 'Invalid input'
      } else {
        const hashedPassword = bcrypt.hash(req.body.new_password, 10)
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `UPDATE user SET role = ?, username = ?, password = ? WHERE username = ?`,
        [req.body.new_role.toLowerCase(), req.body.new_username, hashedPassword, req.body.old_username], false)
        res.json({message: `Edit success for ${req.body.old_username}`}).send()
      }
    } catch (error) {
      console.log('Error on /api/editUser') // temp
      console.log(error) // temp
      res.json({message: error}).send()
    }
  })
  // end edit user

  // delete user
  router.post('/api/deleteUser', adminOnly, async (req, res) => {
    try {
      if (!req.body.username) {
        throw 'Invalid request body'
      } else {
        const source = './database/db.sqlite'
        const db = await database.openOrCreateDB(source)
        await database.run(db, `
          DELETE FROM user WHERE username = ?
        `, [req.body.username], false)
        res.json({message: `Delete success for user ${req.body.username}`}).send()
      }
    } catch (error) {
      console.log('Error on /api/deleteUser') // temp
      console.log(error) // temp
      res.json({message: error}).send()
    }
  })
  // end delete user

// end Routes

// middlewares
function adminOnly(req, res, next) {
  try {
    if ((req.user.role !== 'admin') || (!req.user.role)) {
      res.status(401).json('Not admin.').send()
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on auth.js > adminOnly middleware') // temp
    console.log(error) // temp
    res.status(401).send()
  }
}
function authorize(req, res, next) {
  try {
    // insert routes that you want to protect here
    if (req.url === '/login') {
      if (req.user) {
        if (req.user.role === 'social worker') {
          res.redirect('/socialworker')
        } else {
          res.redirect('/' + req.user.role)
        }
      } else {
        next()
      }
    } else if (req.url === '/') {
      if (!req.user) {
        res.redirect('/login')
      } else {
        next()
      }
    } else if (req.url === '/receptionist') {
      if (req.user.role === 'receptionist') {
        next()
      } else {
        res.redirect('/login')
      }
    } else if (req.url === '/socialworker') {
      if (req.user.role === 'social worker') {
        next()
      } else {
        res.redirect('/login')
      }
    } else if (req.url === '/cashier') {
      if (req.user.role === 'cashier') {
        next()
      } else {
        res.redirect('/login')
      }
    } else if (req.url === '/anthropometrics') {
      if (req.user.role === 'anthropometrics') {
        next()
      } else {
        res.redirect('/login')
      }
    } else if (req.url === '/doctor') {
      if (req.user.role === 'doctor') {
        next()
      } else {
        res.redirect('/login')
      }
    } else if (req.url === '/admin') {
      if (req.user.role === 'admin') {
        next()
      } else {
        res.redirect('/login')
      }
    } else {
      next()
    }
  } catch (error) {
    console.log('Error on auth.js > authorize middlewares')
    console.log(error)
    res.redirect('/')
  }
}
// end middlewares

module.exports = {authorize, main, configureLocalStrategy, router}
