const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// var flash = require('express-flash')

router = express.Router()

//Models
const Dream = require('../models/dream');
const User = require('../models/user');


// Render all views
router.get('/dream', (req, res) => {
  // req.flash('dream', 'Dream List');
  User.findById({ _id: req.user._id }).populate('dreams')
    .exec(function (err, user) {
      // console.log(user);
      // console.log(err);

      if (!err){
        if (user){
            const dreams = user.dreams
            return res.status(200).json({ dreams, success: true, message:"successfuly recieved!! :)" })
          }
      }
      else{
        // console.log(user.dreams);
          console.log(user);
          return res.status(401).json({ success: true, error: err })

      }
    }).catch((err) =>{
      return res.status(401).json({ success: false, message:"Error!" })

    })
})


//Post a dream to the Database
router.post('/dream/new', (req,res) => {
    const dream = new Dream()
    //Add new entry
    dream.entry = req.body.entry;
    dream.title = req.body.title;
    dream.tags = req.body.tags
    dream.author = req.user._id;
    //Save dream and add to user.
    dream.save().then((dream) => {

      return User.findById({ _id: dream.author })

    }).then((user) => {
        //Store the dream id to the user.
        user.dreams.unshift(dream)
        console.log(user.dreams)
        user.save()
        //res.redirect('/dream')
        res.status(201).json({ dream, success: false, err: null })
      })
      .catch((err) => {
        console.log(err)
        res.json({ dream, success: true, err: err })
    });
})


//Show dream by Id
router.get('/dream/:dreamId',(req,res) => {
  // req.flash('dream', 'Display Dream');

  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}

  console.log("get /dream/:id req.params : ", req.params)
  Dream.findById({ _id: req.params.dreamId }).populate('author').exec((err, dream) => {
    if(!err){
      return res.send({ dream: dream, success: true, message:'successfuly recieved dream entry', err: null })
    }else{
      console.log("get dream/:id err - ", err)
      return res.send("Oops!")
    }
  })
})


router.get('/dream/:dreamId/delete', (req, res) => {
  Dream.findByIdAndRemove({ _id: req.params.dreamId }).exec((err,dream) =>{
    if (!err){
      console.log("Dream Deleted successfully")
      return res.status(200).json({ message: "Dream Deleted successfully", success: true, err: null })
    }
    else{
      return res.status(400).json({ message: "Dream Deleted", success: false, err: true})
    }
  })
})


router.post('/dream/:dreamId/edit', (req, res) => {
  console.log(req.body.tags)
  const dreamId = req.params.dreamId
  Dream.findById({ _id: req.params.dreamId }).populate('author').exec((err, dream) => {
    if(dream){
      if (req.body.title && req.body.entry && req.body.tags){
        dream.title = req.body.title
        dream.tags = req.body.tags
        dream.entry = req.body.entry
        dream.save()
          .then((dream) => {
              res.json({ dream: dream, message: 'successfully edited', success:true, err: null })
          })
          .catch((err) =>{
              res.json({ message: 'could not save dream', success:false, err: true })
          })
      }
      else{
        res.json({ message: 'all fields not entered', success: false, err: true })
      }
    }
    else {
      console.log('didn\'t find dream');
      return res.json({ message: err, success: false, err: true })
    }
  })
})


router.get('/dream/tag/:tagName', (req, res) => {
  let selectTag = req.params.tagName;
  let bodyClass = "dream tag-search"
  if (req.user) {
    bodyClass += "loggedin"
  }
  Dream.find({ tags: selectTag }, (err, dreams) => {
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
