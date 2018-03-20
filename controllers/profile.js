const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// var flash = require('express-flash')
router = express.Router()

const User = require('../models/user')


// Needs some comments...
router.get('/profile', (req, res) => {
  // req.flash('profile', 'My Profile');
  // let bodyClass = "profile"
  // if(req.bodyClass){
  //   bodyClass += req.bodyClass
  // }
  // Search for id
  User.findById({ _id: req.user._id }, (err, user) => {
    if (err){
      console.log(err)
    }
    console.log(user)
    // res.render('profile' , {bodyClass, user})
  })
})


module.exports = router
