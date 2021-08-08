const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const usePassport = require('./config/passport')
require('./config/mongoose')
const routes = require('./routes')

const app = express()
const port = 3000

const hbs = exphbs.create({ defaultLayout: 'main', extname: '.hbs' })
hbs.handlebars.registerHelper('ifEqual', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'FullOfCats',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next)=> {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})



app.use(routes)


app.listen(port, () => {
  console.log(`Express is now listening to http://localhost:${port}`)
})