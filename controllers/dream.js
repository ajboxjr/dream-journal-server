//Models
const mongoose = require('mongoose')
const Dream = mongoose.model('Dream')
const User = mongoose.model('User')
// const Dream = require('../models/dream');
// const User = require('../models/user');
const { dreamResponse, errorResponse } = require('../handlers/jsonResponse/jsonResponse')
const _ = require("underscore")

/*
    Populate a list of dreams
*/

exports.getDreamList = async (req, res) => {
  try {
    const user = await User.findById({_id: req.user._id}).populate('dreams').exec()
    if (!user) {
      return res.status(401).json(errorResponse("User not Found"))
    }
    const dreams = user.dreams
    res.status(200).json(dreamResponse(dreams))
  } catch (err) {
    res.status(401).json(errorResponse('Problem populating dreams'))
  }
}

  /*
  Post a dream to the Database
  body: entry, title, tags, author
*/

  exports.createDream = (req, res) => {
    //copy req.body into object
    const dream = new Dream(_.extend({
      author: req.user._id
    }, req.body))
    //Save dream and add to user.
    dream.save().then((dream) => {

      return User.findById({_id: dream.author})

    }).then((user) => {
      //Store the dream id to the user.
      user.dreams.unshift(dream)
      user.save().then((user) => {
        // FIXME: PULL REQUEST TO MAKE ALL DATA an array
        res.status(201).json(dreamResponse([dream]))
      })
      //res.redirect('/dream')
    }).catch((err) => {
      res.json(errorResponse(err))
    });
  }

  /*
  Show dream by Id
  params: dreamId
*/

  exports.getDream = async (req, res) => {
    try {
      const dream = await Dream.findById({_id: req.params.dreamId}).populate({path: 'author', select: 'username _id'}).exec()
      if (!dream) {
        return res.json(errorResponse("Dream not found"))
      }
      res.json(dreamResponse(dream))

    }
    catch (err) {
      res.json(errorResponse(err))
    }
  }

  /*
  Delete Dream By ID
  params: dreamID
*/

  exports.deleteDream = async (req, res) => {
    try {
      const user = await User.findById({_id: req.user._id}).exec()
      if (!user) {
        //Not Found
        return res.status(400).json(errorResponse("User not found"))
      }
      //Delete Dream
      user.dreams.splice(req.params.dreamId, 1)
      user.save()
      Dream.findByIdAndRemove({_id: req.params.dreamId}).exec((err, dream) => {
        if (!dream) {
          //Error in deletion
          return res.status(400).json(errorResponse("Dream not Found"))
        }
        res.status(204).json({})
      })
    }
    catch(err){
      res.status(400).json(errorResponse("h"))

    }
}
  /*
  Edit Dream by ID
  params: dreamID
*/

  exports.editDream = async (req, res) => {
    const dreamId = req.params.dreamId
    try {
      const dream = await Dream.findById({_id: req.params.dreamId}).exec()

        if(!dream){
          return res.status(404).json(errorResponse("Dream not found"))
        }
        dream.title = req.body.title
        dream.tags = req.body.tags
        dream.entry = req.body.entry
        dream.save().then((update_dream) => {
          // FIXME: PULL REQUEST TO MAKE ALL DATA an array
          res.status(200).json(dreamResponse([update_dream]))
        }).catch((err) => {
          res.status(500).json(errorResponse("Couldn't save dream"))
        })
    }
    catch (err){
      res.status(404).json(errorResponse(err))
    }
  }
