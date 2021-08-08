const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../../models/user')

//Login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

//Register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!email | !password | !confirmPassword) {
    console.log('姓名以外的資料皆為必填。')
    return res.render('register', { name, email, password, confirmPassword })
  }

  if (password !== confirmPassword) {
    console.log('密碼與確認密碼不相符。')
    return res.render('register', { name, email, password, confirmPassword })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('此Email已經註冊，請直接登入。')
        res.render('register', { name, email, password, confirmPassword })
      } else {
        return User.create({ name, email, password })
          .then(() => res.redirect('/'))
          .catch((error => console.log(error)))
      }
    })
})

//Logout
router.get('/logout', (req, res) => {
  res.redirect('/users/login')
})

module.exports = router