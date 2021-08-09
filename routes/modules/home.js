const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//瀏覽所有餐廳
router.get('/', (req, res) => {
  const userId = req.user._id

  Restaurant.find({ userId })
    .lean()
    .sort({ id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => res.render('error', { error }))
})

module.exports = router