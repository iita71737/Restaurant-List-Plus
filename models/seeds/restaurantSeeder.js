const Restaurant = require('../restaurant')
const restaurantData = require('./restaurant.json')
const restaurantList = restaurantData.results

const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.forEach((res) => {
    Restaurant.create({
      name: res.name,
      name_en: res.name_en,
      category: res.category,
      image: res.image,
      location: res.location,
      phone: res.phone,
      google_map: res.google_map,
      rating: res.rating,
      description: res.description
    })
  })
  console.log('done!')
})

