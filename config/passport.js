const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')

module.exports = (app) => {
  //Initialise passport
  app.use(passport.initialize())
  app.use(passport.session())

  //Set Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Email or Password incorrect!' })
        }
        console.log('Login successfully!')
        return done(null, user)
      })
      .catch(error => console.log(error))
  }))

  //Serialise and Deserialise
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })

}