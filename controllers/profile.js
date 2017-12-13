const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
router = express.Router()

const User = require('../models/user')

// Needs some comments...
router.get('/profile', (req, res) => {
  let bodyClass = "profile"
  if(req.bodyClass){
    bodyClass += req.bodyClass
  }
  // Search for id
  User.findById({_id: req.user._id}, (err, user) => {
    if (err){
      console.log(err)
    }
    console.log(user)
    res.render('profile' , {bodyClass, user})
  })
})


module.exports = router
