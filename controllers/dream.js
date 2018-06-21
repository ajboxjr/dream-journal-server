//Models
const mongoose = require('mongoose')
const Dream = mongoose.model('Dream')
const User = mongoose.model('User')
// const Dream = require('../models/dream');
// const User = require('../models/user');


/*
    Populate a list of dreams
*/

exports.getDreamList = (req, res ) => {
  console.log(req.user._id);
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
}

/*
  Post a dream to the Database
  body: entry, title, tags, author
*/

exports.createDream = (req, res) => {
    console.log(req.user._id);
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
}

/*
  Show dream by Id
  params: dreamId
*/

exports.getDream = (req, res) => {

  Dream.findById({ _id: req.params.dreamId }).populate({path: 'author', select:'username _id'}).exec((err, dream) => {
    if(dream){
      res.json({ dream: dream, success: true, message:'successfuly recieved dream entry', err: null })
    }else{
      res.json({message:'Dream not Found', err:err})
    }
  })
}

/*
  Delete Dream By ID
  params: dreamID
*/

exports.deleteDream = (req, res) => {
  User.findById({_id: req.user._id}).exec((err, user)=>{
    if (user){
      //Delete Dream
      user.dreams.splice(req.params.dreamId,1)
      user.save()
      Dream.findByIdAndRemove({ _id: req.params.dreamId }).exec((err,dream) =>{
        if (dream){
          res.status(200).json({ message: "Dream Deleted successfully", success: true, err: null })
        }
        else{
          //Error in deletion
          res.status(400).json({message:'Dream not Found', err:err})
        }
      })
    }
    else {
      //Not Found
      res.status(400).json({message:'User not found', err:err})
    }
  })
}

/*
  Edit Dream by ID
  params: dreamID
*/

exports.editDream = (req, res) => {
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
}
