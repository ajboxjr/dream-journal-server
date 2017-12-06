const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
router = express.Router()

const User = require('../models/user')

router.get('/profile', (req, res) => {
  let bodyClass = "profile"
  if(req.bodyClass){
    bodyClass += req.bodyClass
  }
  User.findById({_id: req.user._id}, (user) => {
    res.render('profile' , {bodyClass, user})
  })
})


module.exports = router
