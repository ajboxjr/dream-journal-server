const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
router = express.Router()

//Models
const Dream = require('../models/dream')
const User = require('../models/user')


// Render all views
router.get('/dream', (req, res) => {
  let bodyClass = "dream "
	bodyClass += req.bodyClass
  Dream.find({}, (err, dreams) => {
      console.log(dreams)
      res.render('dreams', { bodyClass, dreams: dreams })
  })
})

//Post a dream to the Database
router.post('/dream/new', (req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}

  const dream = new Dream(req.body)
  dream.author = req.user._id
  dream.save().then((dream) =>{
    res.redirect('/dream')

  }).catch((err) => {
    console.log(err)
  });
})

// Create a new dream
router.get('/dream/new', (req, res) => {
  if(req.user === null){
    res.redirect('/login')
  }
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}

  res.render('dream-new', {bodyClass})
})

//Show dream by Id
router.get('/dream/:dreamId',(req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  Dream.findById({_id: req.params.dreamId}, (err, dream) => {
    if(err){
      console.log(err)
    }
    res.render('dream',{ bodyClass, dream: dream })
  })
})

//Edit A dream information
router.get('/dream/:dreamId/edit', (req, res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
  res.send('Edit dream based on ID')
})

module.exports = router
