const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

router = express.Router()

//Models
const Dream = require('../models/dream');
const User = require('../models/user');


// Render all views
router.get('/dream', (req, res) => {
  User.findById({ _id: req.user._id }).populate('dreams')
    .exec(function (err, user) {

      if (!err){
        if (user){
            const dreams = user.dreams
            res.status(200).json({ dreams, success: true, message:"successfuly recieved!! :)" })
          }
      }
      else{
          res.status(401).json({ success: true, error: err })

      }
    }).catch((err) =>{
      res.status(401).json({ success: false, message:"Error!" })

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
        user.save().then((user) =>{
          res.status(201).json({ dream, success: true, err: null })
        })
        //res.redirect('/dream')
      })
      .catch((err) => {
        res.json({ dream, success: false, err: err })
    });
})


//Show dream by Id
router.get('/dream/:dreamId',(req,res) => {

  let bodyClass = "dream"
	if (req.user) {
		bodyClass += " loggedin"
	}

  console.log("get /dream/:id req.params : ", req.params)
  Dream.findById({ _id: req.params.dreamId }).populate({path: 'author', select:'username _id'}).exec((err, dream) => {
    if(dream){
      res.json({ dream: dream, success: true, message:'successfuly recieved dream entry', err: null })
    }else{
      console.log("get dream/:id err - ", err)
      res.json({message:'Dream not Found', err:err})
    }
  })
})


router.delete('/dream/:dreamId/delete', (req, res) => {
  console.log(req.params.dreamId);
  User.findById({_id: req.user._id}).exec((err, user)=>{
    if (user){
      user.dreams.splice(req.params.dreamId,1)
      user.save()
      console.log("User deleted dream successfuly")
      Dream.findByIdAndRemove({ _id: req.params.dreamId }).exec((err,dream) =>{
        if (dream){
          console.log("Dream Deleted successfully")
          res.status(200).json({ message: "Dream Deleted successfully", success: true, err: null })
        }
        else{
          console.log("User dream not found")
          res.status(400).json({message:'Dream not Found', err:err})
        }
      })
    }
    else {
      console.log("User dream not found")
      res.status(400).json({message:'User not found', err:err})
    }
  })
})


router.post('/dream/:dreamId/edit', (req, res) => {
  console.log(req.body.tags)
  const dreamId = req.params.dreamId
  Dream.findById({ _id: req.params.dreamId }).populate({path: 'author', select:'username _id'}).exec((err, dream) => {
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
              res.status(500).json({ message: 'could not save dream', success:false, err: true })
          })
      }
      else{
        res.status(404).json({ message: 'all fields not entered', success: false, err: true })
      }
    }
    else {
      res.status(404).json({ message: err, success: false })
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
