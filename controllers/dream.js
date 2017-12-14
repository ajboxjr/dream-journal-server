const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
router = express.Router()

//Models
const Dream = require('../models/dream');
const User = require('../models/user');


// Render all views
router.get('/dream', (req, res) => {
  let bodyClass = "dream ";
	bodyClass += req.bodyClass;
  // *** Use a promise !!!!
  // Dream.find().then.catch()
  Dream.find({author: req.user._id}).exec(function (err, dream) {
    console.log(dream)
    res.render('dreams', { dreams: dream })
  })
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

//Post a dream to the Database
router.post('/dream/new', (req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}
    console.log(req.body)
    const dream = new Dream()
    //Add new entry
    dream.entry = req.body.entry;
    dream.title = req.body.title;
    dream.tags = req.body.tags.replace(/\s/g, '').split(",");
    dream.author = req.user._id;
    const user = User.findById({_id: dream.author})
    //Save dream and add to user.
    dream.save().then((dream) => {
      return User.findById({_id: req.user._id})
    }).then((user) =>{
        //Store the dream id to the user.
        user.dreams.unshift(dream)
        console.log(user.dreams)
        user.save()
        res.redirect('/dream')
      }).catch((err) => {
        console.log(err)
      });
})

//Show dream by Id
router.get('/dream/:dreamId',(req,res) => {
  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}

  console.log("get /dream/:id req.params : ", req.params)

  Dream.findById({_id: req.params.dreamId}).populate('author').exec((err, dream) => {
    if(err){
      console.log("get dream/:id err - ", err)
      return res.send("Oops!")
    }
    res.render('dream', { bodyClass, dream })
    // res.send("Huh?")
  })
})

router.get('/dream/:dreamId/delete', (req, res) => {
  Dream.findByIdAndRemove({_id: req.params.dreamId}).exec((err,dream) =>{
    console.log("Dream Deleted Sucessfully")
    res.redirect('/dream')
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

router.get('/dream/tag/:tagName', (req, res) => {
  let selectTag = req.params.tagName;
  let bodyClass = "dream tag-search"
  if (req.user) {
    bodyClass += "loggedin"
  }
  Dream.find({ tags: selectTag}, (err, dreams) => {
    console.log(dreams)
    res.render('search', { dreams })
  })
})

router.post('/dream/search/', (req, res) => {
  let search = req.body
    Dream.search(req.body.search, (err, dreams) =>{
      if (err){
        console.log(err);
      }
      console.log(dreams);

      res.render('search', { search, dreams })
    })
  })

module.exports = router
