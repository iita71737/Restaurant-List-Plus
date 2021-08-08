const express = require('express')
const restaurant = require('../../models/restaurant')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


//Login
router.get('/login', (req, res) => {
  res.render('login')
})

//Register
router.get('/register', (req, res) => {
  res.render('register')
})

//Logout
router.get('/logout', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router