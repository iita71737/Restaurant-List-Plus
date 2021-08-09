const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('./restaurant.json').results

const db = require('../../config/mongoose')

const SEED_USER = [{
  email: 'user1@example.com',
  password: '12345678',
  res_index: [0, 1, 2]
},
{
  email: 'user2@example.com',
  password: '12345678',
  res_index: [3, 4, 5]
}]

db.once('open', () => {
  Promise.all(Array.from(SEED_USER, (SEED_USER, i) => {
    const restaurantIndexes = SEED_USER.res_index
    console.log(restaurantIndexes)

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({ email: SEED_USER.email, password: hash }))
      .then(user => {
        const userId = user._id
        const restaurants = Array.from(SEED_USER.res_index, i => restaurantList[i])
        restaurants.forEach(restaurant => { restaurant.userId = userId })
        return Restaurant.create(restaurants)
      })
  }))
    .then(() => {
      console.log('All done!')
      process.exit()
    })
    .catch(error => console.log(error))
})


// 控制不住流程的順序
// SEED_USER.forEach((seed_user) => {
//   db.once('open', () => {
//     bcrypt
//       .genSalt(10)
//       .then(salt => bcrypt.hash(seed_user.password, salt))
//       .then(hash => User.create({ email: seed_user.email, password: hash }))
//       .then(user => {
//         const userId = user._id
//         return Promise.all(Array.from(
//           seed_user.res_index, i => Restaurant.create({ ...restaurantList[i], userId })
//         ))
//       })
//       .then(() => {
//         console.log(`${seed_user.email} done`)
//         process.exit()
//       })
//       .catch(error => console.log(error))
//   })
// })