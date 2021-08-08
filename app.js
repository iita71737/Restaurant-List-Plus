const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

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


app.use(routes)


app.listen(port, () => {
  console.log(`Express is now listening to http://localhost:${port}`)
})