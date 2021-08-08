const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const errors = []

  if (!email | !password | !confirmPassword) {
    errors.push({ message: '姓名以外的資料皆為必填。' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符。' })
    return res.render('register', { name, email, password, confirmPassword, errors })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此Email已經註冊過了。' })
        res.render('register', { name, email, password, confirmPassword, errors })
      } else {
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => {
            User.create({ name, email, password: hash })
          })
          .then(() => res.redirect('/users/login'))
          .catch((error => console.log(error)))
      }
    })
})

//Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router