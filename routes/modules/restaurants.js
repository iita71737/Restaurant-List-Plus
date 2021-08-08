const express = require('express')
const restaurant = require('../../models/restaurant')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


//搜尋餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.trim()
  const sortBy = req.query.sortBy
  const sortMongoose = {
    name_asc: { name: 'asc' },
    name_desc: { name: 'desc' },
    category: { category: 'asc' },
    rating: { rating: 'desc' }
  }

  Restaurant.find({ userId, $or: [{ name: { $regex: keyword } }, { category: { $regex: keyword } }] })
    .lean()
    .sort(sortMongoose[sortBy])
    .then((res_filtered => res.render('index', { restaurants: res_filtered, keyword, sortBy })))
    .catch(error => console.log(error))
})

//新增餐廳
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const options = req.body
  const { name, name_en, category, image, location, google_map, rating, description, phone } = req.body

  const google_map_regex = /(https|http):\/\/(www\.|)google\.[a-z]+(\.[a-z]+|)\/maps/

  if (!google_map.match(google_map_regex)) {
    const error_message = "Google map 連結"
    return res.render('new', { options, error_message })
  }

  return Restaurant.create({ name, name_en, category, image, location, google_map, rating, description, phone, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  return Restaurant.find({ _id, userId })
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

//編輯餐廳
router.get('/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  return Restaurant.find({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  const { name, name_en, category, image, location, google_map, rating, description, phone } = req.body
  const google_map_regex = /(https|http):\/\/(www\.|)goo(gle|)\.[a-z]+(\.[a-z]+|)\/maps/

  if (!google_map.match(google_map_regex)) {
    const error_message = "Google map 連結"
    return Restaurant.find({ _id, userId })
      .lean()
      .then((restaurant) => res.render('edit', { restaurant, error_message }))
  }

  return Restaurant.find({ _id, userId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      restaurant.phone = phone
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))

})

//刪除餐廳
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  const userId = req.user._id

  return Restaurant.find({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router